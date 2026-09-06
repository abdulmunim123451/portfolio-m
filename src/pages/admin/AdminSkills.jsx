import React, { useState, useEffect } from 'react';
import {
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
} from '../../firebase/firestore';
import { uploadFile, deleteFile, validateImage } from '../../firebase/storage';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const AdminSkills = () => {
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Edit or Add state
  const [editingSkill, setEditingSkill] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Programming Languages',
    iconUrl: '',
    iconPath: '',
    level: 85,
    displayOrder: 1,
  });
  const [selectedIconFile, setSelectedIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState('');

  // Delete state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const defaultCategories = [
    'Programming Languages',
    'Full Stack',
    'Backend',
    'Databases',
    'Tools & Automation',
    'Computer Science Concepts',
  ];

  const fetchSkills = async () => {
    setIsLoading(true);
    try {
      const data = await getSkills();
      setSkills(data);
    } catch (err) {
      console.error('Failed to load skills:', err);
      setError('Failed to load skills.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const openAddModal = () => {
    setEditingSkill(null);
    setFormData({
      name: '',
      category: defaultCategories[0],
      iconUrl: '',
      iconPath: '',
      level: 85,
      displayOrder: skills.length + 1,
    });
    setSelectedIconFile(null);
    setIconPreview('');
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name || '',
      category: skill.category || defaultCategories[0],
      iconUrl: skill.iconUrl || '',
      iconPath: skill.iconPath || '',
      level: skill.level || 85,
      displayOrder: skill.displayOrder || 1,
    });
    setSelectedIconFile(null);
    setIconPreview(skill.iconUrl || '');
    setError('');
    setIsModalOpen(true);
  };

  const handleIconChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      validateImage(file, 5);
      setSelectedIconFile(file);
      setIconPreview(URL.createObjectURL(file));
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Skill name is required.');
      return;
    }

    setIsSaving(true);

    try {
      let finalIconUrl = formData.iconUrl;
      let finalIconPath = formData.iconPath;

      if (selectedIconFile) {
        if (formData.iconPath) {
          try {
            await deleteFile(formData.iconPath);
          } catch (delErr) {
            console.warn('Could not delete old icon:', delErr);
          }
        }

        const uploadResult = await uploadFile(selectedIconFile, 'skills');
        finalIconUrl = uploadResult.downloadUrl;
        finalIconPath = uploadResult.storagePath;
      }

      const payload = {
        name: formData.name.trim(),
        category: formData.category.trim(),
        iconUrl: finalIconUrl,
        iconPath: finalIconPath,
        level: Number(formData.level) || 85,
        displayOrder: Number(formData.displayOrder) || 1,
      };

      if (editingSkill) {
        await updateSkill(editingSkill.id, payload);
      } else {
        await addSkill(payload);
      }

      setIsModalOpen(false);
      await fetchSkills();
    } catch (err) {
      console.error('Error saving skill:', err);
      setError(err.message || 'Failed to save skill. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const initiateDelete = (skill) => {
    setSkillToDelete(skill);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!skillToDelete) return;
    setIsDeleting(true);
    try {
      await deleteSkill(skillToDelete.id, skillToDelete.iconPath);
      setDeleteConfirmOpen(false);
      setSkillToDelete(null);
      await fetchSkills();
    } catch (err) {
      console.error('Failed to delete skill:', err);
      alert('Failed to delete skill: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const categoriesInUse = ['All', ...new Set(skills.map((s) => s.category).filter(Boolean))];
  const filteredSkills =
    selectedCategory === 'All'
      ? skills
      : skills.filter((s) => s.category === selectedCategory);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Skills</h1>
          <p className="text-white/60 text-sm mt-1">
            Manage programming languages, frameworks, and engineering skills
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-all shadow-md shadow-red-600/30 flex items-center gap-2 self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          + Add Skill
        </button>
      </div>

      {/* Category Filter Pills */}
      {categoriesInUse.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {categoriesInUse.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Skills List */}
      {isLoading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
        </div>
      ) : filteredSkills.length === 0 ? (
        <div className="text-center py-16 bg-[#121212] rounded-2xl border border-white/10 p-8">
          <p className="text-white/60 text-base mb-4">No skills in Firestore yet.</p>
          <button
            onClick={openAddModal}
            className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-500 transition-colors"
          >
            Add Your First Skill
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="bg-[#141414] border border-white/10 rounded-2xl p-5 flex items-center justify-between hover:border-white/20 transition-all shadow-md"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {skill.iconUrl ? (
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 p-1.5 flex items-center justify-center shrink-0">
                    <img
                      src={skill.iconUrl}
                      alt={skill.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 font-black text-sm flex items-center justify-center shrink-0 border border-red-500/20">
                    {skill.name.charAt(0)}
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-white truncate">{skill.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-white/50 truncate max-w-[120px]">
                      {skill.category}
                    </span>
                    <span className="text-[10px] font-mono text-red-400 font-bold">
                      {skill.level}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <button
                  type="button"
                  onClick={() => openEditModal(skill)}
                  className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                  title="Edit Skill"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => initiateDelete(skill)}
                  className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                  title="Delete Skill"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Skill Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#141414] border border-white/10 rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h2 className="text-xl font-black text-white">
                {editingSkill ? 'Edit Skill' : 'Add New Skill'}
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
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Skill Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. React"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-red-500"
                  disabled={isSaving}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Category
                </label>
                <input
                  type="text"
                  list="category-suggestions"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Select or enter category"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-red-500"
                  disabled={isSaving}
                />
                <datalist id="category-suggestions">
                  {defaultCategories.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Proficiency ({formData.level}%)
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: Number(e.target.value) })}
                    className="w-full accent-red-500 cursor-pointer"
                    disabled={isSaving}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500"
                    disabled={isSaving}
                  />
                </div>
              </div>

              {/* Icon URL / Emoji */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Skill Icon URL or Emoji (Optional)
                </label>
                <input
                  type="text"
                  value={formData.iconUrl}
                  onChange={(e) => {
                    setFormData({ ...formData, iconUrl: e.target.value });
                    setIconPreview(e.target.value);
                  }}
                  placeholder="e.g. ⚡, ⚛️, or https://... (image URL)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-red-500"
                  disabled={isSaving}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
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
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-all shadow-md shadow-red-600/30 flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : editingSkill ? 'Save Changes' : 'Add Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        title="Delete Skill"
        message={`Are you sure you want to delete "${skillToDelete?.name}"?`}
        confirmText="Delete Skill"
        cancelText="Cancel"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setSkillToDelete(null);
        }}
      />
    </div>
  );
};

export default AdminSkills;
