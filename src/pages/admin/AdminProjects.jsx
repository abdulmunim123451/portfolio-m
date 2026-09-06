import React, { useState, useEffect } from 'react';
import {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
} from '../../firebase/firestore';
import { uploadFile, deleteFile, validateImage } from '../../firebase/storage';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(null);

  // Edit or Add state
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    description: '',
    imageUrl: '',
    imagePath: '',
    githubUrl: '',
    liveUrl: '',
    technologies: '',
    featured: false,
    displayOrder: 1,
  });
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Delete state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      console.error('Failed to load projects:', err);
      setError('Failed to load projects.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openAddModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      slug: '',
      shortDescription: '',
      description: '',
      imageUrl: '',
      imagePath: '',
      githubUrl: '',
      liveUrl: '',
      technologies: '',
      featured: false,
      displayOrder: projects.length + 1,
    });
    setSelectedImageFile(null);
    setImagePreview('');
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || '',
      slug: project.slug || '',
      shortDescription: project.shortDescription || '',
      description: project.description || '',
      imageUrl: project.imageUrl || '',
      imagePath: project.imagePath || '',
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      technologies: Array.isArray(project.technologies)
        ? project.technologies.join(', ')
        : '',
      featured: Boolean(project.featured),
      displayOrder: project.displayOrder || 1,
    });
    setSelectedImageFile(null);
    setImagePreview(project.imageUrl || '');
    setError('');
    setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      validateImage(file, 10);
      setSelectedImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Project title is required.');
      return;
    }

    if (!formData.description.trim()) {
      setError('Project description is required.');
      return;
    }

    setIsSaving(true);
    setUploadProgress(0);

    try {
      let finalImageUrl = formData.imageUrl;
      let finalImagePath = formData.imagePath;

      // Handle file upload if new image selected
      if (selectedImageFile) {
        // If replacing an existing image in storage, delete old one
        if (formData.imagePath) {
          try {
            await deleteFile(formData.imagePath);
          } catch (delErr) {
            console.warn('Could not delete old image:', delErr);
          }
        }

        const uploadResult = await uploadFile(
          selectedImageFile,
          'projects',
          (prog) => setUploadProgress(prog)
        );
        finalImageUrl = uploadResult.downloadUrl;
        finalImagePath = uploadResult.storagePath;
      }

      // Parse technologies
      const techArray = formData.technologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        title: formData.title.trim(),
        slug:
          formData.slug.trim() ||
          formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        shortDescription: formData.shortDescription.trim(),
        description: formData.description.trim(),
        imageUrl: finalImageUrl,
        imagePath: finalImagePath,
        githubUrl: formData.githubUrl.trim(),
        liveUrl: formData.liveUrl.trim(),
        technologies: techArray,
        featured: formData.featured,
        displayOrder: Number(formData.displayOrder) || 1,
      };

      if (editingProject) {
        await updateProject(editingProject.id, payload);
      } else {
        await addProject(payload);
      }

      setIsModalOpen(false);
      await fetchProjects();
    } catch (err) {
      console.error('Error saving project:', err);
      setError(err.message || 'Failed to save project. Please try again.');
    } finally {
      setIsSaving(false);
      setUploadProgress(null);
    }
  };

  const initiateDelete = (project) => {
    setProjectToDelete(project);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);
    try {
      await deleteProject(projectToDelete.id, projectToDelete.imagePath);
      setDeleteConfirmOpen(false);
      setProjectToDelete(null);
      await fetchProjects();
    } catch (err) {
      console.error('Failed to delete project:', err);
      alert('Failed to delete project: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Projects</h1>
          <p className="text-white/60 text-sm mt-1">
            Manage projects displayed in the public portfolio showcase
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-all shadow-md shadow-red-600/30 flex items-center gap-2 self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          + Add Project
        </button>
      </div>

      {/* Projects List */}
      {isLoading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16 bg-[#121212] rounded-2xl border border-white/10 p-8">
          <p className="text-white/60 text-base mb-4">No projects in Firestore yet.</p>
          <button
            onClick={openAddModal}
            className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-500 transition-colors"
          >
            Create Your First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-[#141414] border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-white/20 transition-all shadow-lg"
            >
              <div>
                {/* Top badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-white/40">
                      #{project.displayOrder}
                    </span>
                    {project.featured && (
                      <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-[10px] font-bold uppercase tracking-wider">
                        Featured
                      </span>
                    )}
                  </div>
                  {project.shortDescription && (
                    <span className="text-[11px] text-white/50 truncate max-w-[160px]">
                      {project.shortDescription}
                    </span>
                  )}
                </div>

                {/* Project Image if available */}
                {project.imageUrl && (
                  <div className="w-full h-40 rounded-xl overflow-hidden mb-4 bg-black/40 border border-white/5">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Title */}
                <h3 className="text-xl font-black text-white mb-2">{project.title}</h3>

                {/* Description */}
                <p className="text-white/60 text-xs leading-relaxed line-clamp-3 mb-4 font-medium">
                  {project.description}
                </p>

                {/* Tech tags */}
                {Array.isArray(project.technologies) && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.technologies.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/70 text-[10px] font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 font-semibold"
                    >
                      Demo ↗
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-white/60 hover:text-white transition-colors flex items-center gap-1 font-semibold"
                    >
                      GitHub ↗
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(project)}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => initiateDelete(project)}
                    className="px-3 py-1.5 rounded-lg bg-red-600/10 hover:bg-red-600/30 text-red-400 border border-red-500/20 text-xs font-semibold transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#141414] border border-white/10 rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h2 className="text-xl font-black text-white">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button
                type="button"
                disabled={isSaving}
                onClick={() => setIsModalOpen(false)}
                className="text-white/50 hover:text-white transition-colors text-xl font-bold"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. AI-Powered Platform"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-red-500"
                    disabled={isSaving}
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. ai-powered-platform"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-red-500"
                    disabled={isSaving}
                  />
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Short Description / Badge
                </label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="e.g. Full-Stack Web App"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-red-500"
                  disabled={isSaving}
                />
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Full Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Comprehensive description of architecture, features, and tech stack..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-red-500 resize-none"
                  disabled={isSaving}
                />
              </div>

              {/* Technologies */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Technologies (Comma Separated)
                </label>
                <input
                  type="text"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  placeholder="React, Spring Boot, Java, MySQL, Tailwind CSS"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-red-500"
                  disabled={isSaving}
                />
              </div>

              {/* Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    placeholder="https://myproject.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-red-500"
                    disabled={isSaving}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-red-500"
                    disabled={isSaving}
                  />
                </div>
              </div>

              {/* Project Image URL */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Project Image URL
                </label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => {
                    setFormData({ ...formData, imageUrl: e.target.value });
                    setImagePreview(e.target.value);
                  }}
                  placeholder="https://... or /assets/... (hosted image, GitHub, Imgur, etc.)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-red-500 mb-2"
                  disabled={isSaving}
                />
                {imagePreview && (
                  <div className="flex items-center gap-3 mt-2">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-black/40 border border-white/10 shrink-0">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={() => {}}
                      />
                    </div>
                    <span className="text-[11px] text-white/40">Preview of project image</span>
                  </div>
                )}
              </div>

              {/* Featured & Display Order */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-white select-none">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded border-white/20 bg-black/40 text-red-500 focus:ring-0 cursor-pointer"
                  />
                  Featured Flagship Project
                </label>

                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-white/70">Display Order:</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                    className="w-20 px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs text-center focus:outline-none focus:border-red-500"
                    disabled={isSaving}
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-all shadow-md shadow-red-600/30 flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving && (
                    <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  {isSaving ? 'Saving Project...' : editingProject ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        title="Delete Project"
        message={`Are you sure you want to delete "${projectToDelete?.title}"? This action cannot be undone and will permanently remove this project and any associated image from Firebase Storage.`}
        confirmText="Delete Project"
        cancelText="Cancel"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setProjectToDelete(null);
        }}
      />
    </div>
  );
};

export default AdminProjects;
