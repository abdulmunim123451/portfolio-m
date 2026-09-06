import React, { useState, useEffect } from 'react';
import { getResume, updateResume, deleteResume } from '../../firebase/firestore';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import * as staticData from '../../data/portfolioData';

const DEFAULT_RESUME_URL = staticData.personalInfo?.resumeUrl || '/Md_Yusuf_Resume_2026.pdf';
const DEFAULT_RESUME_NAME = 'Md_Yusuf_Resume_2026.pdf';

const AdminResume = () => {
  const [resume, setResume] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form state
  const [fileName, setFileName] = useState('');
  const [fileUrl, setFileUrl] = useState('');

  const fetchResumeData = async () => {
    setIsLoading(true);
    try {
      const data = await getResume();
      setResume(data);
      if (data) {
        setFileName(data.fileName || '');
        setFileUrl(data.fileUrl || '');
      } else {
        setFileName(DEFAULT_RESUME_NAME);
        setFileUrl(DEFAULT_RESUME_URL);
      }
    } catch (err) {
      console.error('Failed to load resume:', err);
      setError('Failed to load resume status.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResumeData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!fileUrl.trim()) {
      setError('Please provide a valid resume URL or file path.');
      return;
    }

    setError('');
    setSuccessMessage('');
    setIsSaving(true);

    try {
      await updateResume({
        fileName: fileName.trim() || 'Resume.pdf',
        fileUrl: fileUrl.trim(),
        storagePath: '',
      });

      setSuccessMessage('Resume configuration saved successfully to Firestore!');
      await fetchResumeData();
    } catch (err) {
      console.error('Failed to save resume:', err);
      setError(err.message || 'Failed to save resume configuration.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSetDefault = () => {
    setFileName(DEFAULT_RESUME_NAME);
    setFileUrl(DEFAULT_RESUME_URL);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteResume();
      setDeleteConfirmOpen(false);
      setSuccessMessage('Resume document reset. Portfolio will fallback to default.');
      await fetchResumeData();
    } catch (err) {
      console.error('Failed to reset resume:', err);
      alert('Failed to reset resume: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const currentDownloadUrl = fileUrl || resume?.fileUrl || DEFAULT_RESUME_URL;
  const currentDisplayName = fileName || resume?.fileName || DEFAULT_RESUME_NAME;
  const isCustomConfigured = Boolean(resume?.fileUrl && resume.fileUrl !== DEFAULT_RESUME_URL);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="pb-6 border-b border-white/10">
        <h1 className="text-3xl font-black text-white tracking-tight">Resume Management</h1>
        <p className="text-white/60 text-sm mt-1">
          Configure the PDF document link served to visitors and recruiters via your portfolio
        </p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-300 text-sm flex items-center gap-3">
          <svg className="w-5 h-5 text-green-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm flex items-center gap-3">
          <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Spark Plan Tip Banner */}
      <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs leading-relaxed flex items-start gap-3">
        <span className="text-lg shrink-0">💡</span>
        <div>
          <span className="font-bold text-blue-200">Firebase Spark (Free) Plan Tip:</span>
          <p className="mt-0.5 text-blue-300/80">
            You don't need paid Firebase Storage! You can upload your PDF resume to{' '}
            <strong className="text-blue-200">Google Drive</strong> (set sharing to <em>"Anyone with the link can view"</em>),{' '}
            <strong className="text-blue-200">GitHub</strong>, or <strong className="text-blue-200">Dropbox</strong>, and paste the direct link below. You can also point to your local bundle file (e.g. <code className="bg-black/30 px-1 py-0.5 rounded text-blue-200">/Md_Yusuf_Resume_2026.pdf</code>).
          </p>
        </div>
      </div>

      {/* Current Resume Status Card */}
      <div className="p-6 md:p-8 rounded-2xl bg-[#141414] border border-white/10 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-600/10 border border-red-500/20 text-red-400 flex items-center justify-center text-2xl font-black">
              PDF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white truncate max-w-xs md:max-w-md">
                  {currentDisplayName}
                </h2>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    isCustomConfigured
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : 'bg-white/10 text-white/60 border border-white/10'
                  }`}
                >
                  {isCustomConfigured ? 'Custom Link' : 'Default File'}
                </span>
              </div>
              <p className="text-xs text-white/40 mt-1 font-mono truncate max-w-sm md:max-w-lg">
                {currentDownloadUrl}
              </p>
              <p className="text-xs text-white/30 mt-0.5">
                {resume?.updatedAt?.toDate
                  ? `Last updated: ${resume.updatedAt.toDate().toLocaleString()}`
                  : 'Active in portfolio'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentDownloadUrl && (
              <a
                href={currentDownloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Preview Link
              </a>
            )}

            {isCustomConfigured && (
              <button
                type="button"
                onClick={() => setDeleteConfirmOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-red-600/10 hover:bg-red-600/30 text-red-400 border border-red-500/20 text-xs font-semibold transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Configuration Form */}
        <form onSubmit={handleSave} className="pt-6 border-t border-white/10 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2">
                Document Name / Label
              </label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="e.g. Abdul_Munim_Resume_2026.pdf"
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
              />
              <p className="text-[11px] text-white/40 mt-1">
                Display name shown in admin and tooltips.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2">
                Resume Document URL <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="https://drive.google.com/file/... or /Md_Yusuf_Resume_2026.pdf"
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500 transition-colors font-mono"
                required
              />
              <p className="text-[11px] text-white/40 mt-1">
                Direct URL to your PDF document (Google Drive, Dropbox, GitHub, or local path).
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleSetDefault}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-medium border border-white/10 transition-colors"
            >
              Reset to Local Default (/Md_Yusuf_Resume_2026.pdf)
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-xs transition-all shadow-md shadow-red-600/30 flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Save Resume Settings</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Delete / Reset Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        title="Reset Resume to Default"
        message="Are you sure you want to reset the resume configuration? The public portfolio will revert to the default local file (/Md_Yusuf_Resume_2026.pdf)."
        confirmText="Reset Resume"
        cancelText="Cancel"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirmOpen(false)}
      />
    </div>
  );
};

export default AdminResume;
