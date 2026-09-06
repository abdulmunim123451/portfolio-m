import React, { useState, useEffect } from 'react';
import {
  getCertificates,
  addCertificate,
  updateCertificate,
  deleteCertificate,
} from '../../firebase/firestore';
import { uploadFile, deleteFile, validateImage } from '../../firebase/storage';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const AdminCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const [editingCert, setEditingCert] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    date: '',
    description: '',
    certificateUrl: '',
    imageUrl: '',
    imagePath: '',
    displayOrder: 1,
  });
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [certToDelete, setCertToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCerts = async () => {
    setIsLoading(true);
    try {
      const data = await getCertificates();
      setCertificates(data);
    } catch (err) {
      console.error('Failed to load certificates:', err);
      setError('Failed to load certificates.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCerts();
  }, []);

  const openAddModal = () => {
    setEditingCert(null);
    setFormData({
      title: '',
      issuer: '',
      date: '',
      description: '',
      certificateUrl: '',
      imageUrl: '',
      imagePath: '',
      displayOrder: certificates.length + 1,
    });
    setSelectedImageFile(null);
    setImagePreview('');
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (cert) => {
    setEditingCert(cert);
    setFormData({
      title: cert.title || '',
      issuer: cert.issuer || '',
      date: cert.date || '',
      description: cert.description || '',
      certificateUrl: cert.certificateUrl || '',
      imageUrl: cert.imageUrl || '',
      imagePath: cert.imagePath || '',
      displayOrder: cert.displayOrder || 1,
    });
    setSelectedImageFile(null);
    setImagePreview(cert.imageUrl || '');
    setError('');
    setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      validateImage(file, 15);
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

    if (!formData.title.trim() || !formData.issuer.trim()) {
      setError('Certificate title and issuer are required.');
      return;
    }

    setIsSaving(true);

    try {
      let finalImageUrl = formData.imageUrl;
      let finalImagePath = formData.imagePath;

      if (selectedImageFile) {
        if (formData.imagePath) {
          try {
            await deleteFile(formData.imagePath);
          } catch (e) {
            console.warn('Could not delete old certificate file:', e);
          }
        }

        const uploadResult = await uploadFile(selectedImageFile, 'certificates');
        finalImageUrl = uploadResult.downloadUrl;
        finalImagePath = uploadResult.storagePath;
      }

      const payload = {
        title: formData.title.trim(),
        issuer: formData.issuer.trim(),
        date: formData.date.trim(),
        description: formData.description.trim(),
        certificateUrl: formData.certificateUrl.trim(),
        imageUrl: finalImageUrl,
        imagePath: finalImagePath,
        displayOrder: Number(formData.displayOrder) || 1,
      };

      if (editingCert) {
        await updateCertificate(editingCert.id, payload);
      } else {
        await addCertificate(payload);
      }

      setIsModalOpen(false);
      await fetchCerts();
    } catch (err) {
      console.error('Error saving certificate:', err);
      setError(err.message || 'Failed to save certificate.');
    } finally {
      setIsSaving(false);
    }
  };

  const initiateDelete = (cert) => {
    setCertToDelete(cert);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!certToDelete) return;
    setIsDeleting(true);
    try {
      await deleteCertificate(certToDelete.id, certToDelete.imagePath);
      setDeleteConfirmOpen(false);
      setCertToDelete(null);
      await fetchCerts();
    } catch (err) {
      console.error('Failed to delete certificate:', err);
      alert('Failed to delete certificate: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Certificates</h1>
          <p className="text-white/60 text-sm mt-1">
            Manage industry certifications, course completions, and verification links
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-all shadow-md shadow-red-600/30 flex items-center gap-2 self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          + Add Certificate
        </button>
      </div>

      {/* Certificates Grid */}
      {isLoading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
        </div>
      ) : certificates.length === 0 ? (
        <div className="text-center py-16 bg-[#121212] rounded-2xl border border-white/10 p-8">
          <p className="text-white/60 text-base mb-4">No certificates in Firestore yet.</p>
          <button
            onClick={openAddModal}
            className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-500 transition-colors"
          >
            Add Your First Certificate
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-[#141414] border border-white/10 rounded-2xl p-5 flex flex-col justify-between hover:border-white/20 transition-all shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between text-white/40 text-xs mb-2">
                  <span className="font-mono font-bold">#{cert.displayOrder}</span>
                  {cert.date && <span>{cert.date}</span>}
                </div>

                {cert.imageUrl && (
                  <div className="w-full h-32 rounded-xl overflow-hidden bg-black/40 border border-white/5 mb-3">
                    <img src={cert.imageUrl} alt={cert.title} className="w-full h-full object-cover" />
                  </div>
                )}

                <h3 className="text-base font-bold text-white mb-1">{cert.title}</h3>
                <p className="text-xs uppercase tracking-wider font-semibold text-red-400 mb-3">
                  {cert.issuer}
                </p>
                {cert.description && (
                  <p className="text-xs text-white/60 leading-relaxed line-clamp-2 mb-3">
                    {cert.description}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                {cert.certificateUrl ? (
                  <a
                    href={cert.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-red-400 hover:text-red-300 transition-colors font-semibold"
                  >
                    Verify Link ↗
                  </a>
                ) : (
                  <span className="text-[11px] text-white/30">No link</span>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(cert)}
                    className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => initiateDelete(cert)}
                    className="px-3 py-1 rounded-lg bg-red-600/10 hover:bg-red-600/30 text-red-400 border border-red-500/20 text-xs font-semibold transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#141414] border border-white/10 rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h2 className="text-xl font-black text-white">
                {editingCert ? 'Edit Certificate' : 'Add Certificate'}
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
                  Certificate Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Oracle Cloud Infrastructure 2025"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500"
                  disabled={isSaving}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Issuer Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    placeholder="e.g. Oracle / NPTEL"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500"
                    disabled={isSaving}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Issue Date / Year
                  </label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="e.g. 2025"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500"
                    disabled={isSaving}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Verification / Credential URL
                </label>
                <input
                  type="url"
                  value={formData.certificateUrl}
                  onChange={(e) => setFormData({ ...formData, certificateUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500"
                  disabled={isSaving}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Certificate Image URL (Optional)
                </label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => {
                    setFormData({ ...formData, imageUrl: e.target.value });
                    setImagePreview(e.target.value);
                  }}
                  placeholder="https://... (image URL or badge link)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500"
                  disabled={isSaving}
                />
                {imagePreview && (
                  <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/10 overflow-hidden shrink-0 mt-2">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" onError={() => {}} />
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-3">
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
                    {isSaving ? 'Saving...' : editingCert ? 'Save Changes' : 'Add Certificate'}
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
        title="Delete Certificate"
        message={`Are you sure you want to delete "${certToDelete?.title}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setCertToDelete(null);
        }}
      />
    </div>
  );
};

export default AdminCertificates;
