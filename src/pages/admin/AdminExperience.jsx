import React, { useState, useEffect } from 'react';
import {
  getExperience,
  addExperience,
  updateExperience,
  deleteExperience,
} from '../../firebase/firestore';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const AdminExperience = () => {
  const [experiences, setExperiences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const [editingExp, setEditingExp] = useState(null);
  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    currentlyWorking: false,
    description: '',
    technologies: '',
    displayOrder: 1,
  });

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [expToDelete, setExpToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchExperienceData = async () => {
    setIsLoading(true);
    try {
      const data = await getExperience();
      setExperiences(data);
    } catch (err) {
      console.error('Failed to load experience:', err);
      setError('Failed to load experience records.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExperienceData();
  }, []);

  const openAddModal = () => {
    setEditingExp(null);
    setFormData({
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      currentlyWorking: false,
      description: '',
      technologies: '',
      displayOrder: experiences.length + 1,
    });
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (exp) => {
    setEditingExp(exp);
    setFormData({
      jobTitle: exp.jobTitle || '',
      company: exp.company || '',
      location: exp.location || '',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      currentlyWorking: Boolean(exp.currentlyWorking),
      description: exp.description || '',
      technologies: Array.isArray(exp.technologies) ? exp.technologies.join(', ') : '',
      displayOrder: exp.displayOrder || 1,
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.jobTitle.trim() || !formData.company.trim()) {
      setError('Job title and company name are required.');
      return;
    }

    setIsSaving(true);

    try {
      const techArray = formData.technologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        jobTitle: formData.jobTitle.trim(),
        company: formData.company.trim(),
        location: formData.location.trim(),
        startDate: formData.startDate.trim(),
        endDate: formData.currentlyWorking ? '' : formData.endDate.trim(),
        currentlyWorking: formData.currentlyWorking,
        description: formData.description.trim(),
        technologies: techArray,
        displayOrder: Number(formData.displayOrder) || 1,
      };

      if (editingExp) {
        await updateExperience(editingExp.id, payload);
      } else {
        await addExperience(payload);
      }

      setIsModalOpen(false);
      await fetchExperienceData();
    } catch (err) {
      console.error('Error saving experience:', err);
      setError(err.message || 'Failed to save experience record.');
    } finally {
      setIsSaving(false);
    }
  };

  const initiateDelete = (exp) => {
    setExpToDelete(exp);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!expToDelete) return;
    setIsDeleting(true);
    try {
      await deleteExperience(expToDelete.id);
      setDeleteConfirmOpen(false);
      setExpToDelete(null);
      await fetchExperienceData();
    } catch (err) {
      console.error('Failed to delete experience:', err);
      alert('Failed to delete experience: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Experience</h1>
          <p className="text-white/60 text-sm mt-1">
            Manage your professional roles, internships, and organizations
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-all shadow-md shadow-red-600/30 flex items-center gap-2 self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          + Add Experience
        </button>
      </div>

      {/* Experience List */}
      {isLoading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
        </div>
      ) : experiences.length === 0 ? (
        <div className="text-center py-16 bg-[#121212] rounded-2xl border border-white/10 p-8">
          <p className="text-white/60 text-base mb-4">No experience entries in Firestore yet.</p>
          <button
            onClick={openAddModal}
            className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-500 transition-colors"
          >
            Add Your First Experience
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="bg-[#141414] border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-white/20 transition-all shadow-lg"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-white/40">#{exp.displayOrder}</span>
                  <h3 className="text-lg font-black text-white">{exp.jobTitle}</h3>
                  <span className="text-xs font-bold uppercase tracking-wider text-red-400 bg-red-500/10 px-2.5 py-0.5 rounded-full border border-red-500/20">
                    {exp.company}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-white/50">
                  <span>
                    📅 {exp.startDate} {exp.currentlyWorking ? '– Present' : exp.endDate ? `– ${exp.endDate}` : ''}
                  </span>
                  {exp.location && <span>📍 {exp.location}</span>}
                </div>
                {exp.description && (
                  <p className="text-xs text-white/70 max-w-2xl leading-relaxed">
                    {exp.description}
                  </p>
                )}
                {Array.isArray(exp.technologies) && exp.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {exp.technologies.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/60 font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => openEditModal(exp)}
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => initiateDelete(exp)}
                  className="px-3.5 py-1.5 rounded-xl bg-red-600/10 hover:bg-red-600/30 text-red-400 border border-red-500/20 text-xs font-semibold transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#141414] border border-white/10 rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h2 className="text-xl font-black text-white">
                {editingExp ? 'Edit Experience' : 'Add Experience'}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Job Title / Role *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    placeholder="e.g. Software Engineer Intern"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500"
                    disabled={isSaving}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Company / Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Google / Netlink"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500"
                    disabled={isSaving}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Start Date / Duration
                  </label>
                  <input
                    type="text"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    placeholder="e.g. June 2025"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500"
                    disabled={isSaving}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    End Date
                  </label>
                  <input
                    type="text"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    placeholder="e.g. August 2025"
                    disabled={isSaving || formData.currentlyWorking}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500 disabled:opacity-40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Bhopal, India"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500"
                    disabled={isSaving}
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-white select-none">
                <input
                  type="checkbox"
                  checked={formData.currentlyWorking}
                  onChange={(e) => setFormData({ ...formData, currentlyWorking: e.target.checked })}
                  className="w-4 h-4 rounded border-white/20 bg-black/40 text-red-500 focus:ring-0 cursor-pointer"
                />
                Currently Working Here
              </label>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Skills Gained / Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Data Analytics, Business Intelligence, Dashboard Design, Data Modeling"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500 resize-none"
                  disabled={isSaving}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Technologies (Comma Separated)
                </label>
                <input
                  type="text"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  placeholder="MySQL, Excel, Lumenore, BI Tools"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500"
                  disabled={isSaving}
                />
              </div>

              <div className="flex justify-between items-center pt-2">
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

                <div className="flex items-center gap-3">
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
                    {isSaving ? 'Saving...' : editingExp ? 'Save Changes' : 'Add Experience'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        title="Delete Experience"
        message={`Are you sure you want to delete "${expToDelete?.jobTitle} at ${expToDelete?.company}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setExpToDelete(null);
        }}
      />
    </div>
  );
};

export default AdminExperience;
