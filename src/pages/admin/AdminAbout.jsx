import React, { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../../firebase/firestore';
import { uploadFile, deleteFile, validateImage } from '../../firebase/storage';
import * as staticData from '../../data/portfolioData';

const AdminAbout = () => {
  const [formData, setFormData] = useState({
    name: '',
    headline: '',
    shortBio: '',
    aboutDescription: '',
    location: '',
    email: '',
    profileImageUrl: '',
    profileImagePath: '',
    githubUrl: '',
    linkedinUrl: '',
    twitterUrl: '',
    instagramUrl: '',
    youtubeUrl: '',
    websiteUrl: '',
  });

  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      try {
        const profile = await getProfile();
        if (profile) {
          setFormData({
            name: profile.name || '',
            headline: profile.headline || '',
            shortBio: profile.shortBio || '',
            aboutDescription: profile.aboutDescription || '',
            location: profile.location || '',
            email: profile.email || '',
            profileImageUrl: profile.profileImageUrl || '',
            profileImagePath: profile.profileImagePath || '',
            githubUrl: profile.githubUrl || '',
            linkedinUrl: profile.linkedinUrl || '',
            twitterUrl: profile.twitterUrl || '',
            instagramUrl: profile.instagramUrl || '',
            youtubeUrl: profile.youtubeUrl || '',
            websiteUrl: profile.websiteUrl || '',
          });
          setImagePreview(profile.profileImageUrl || '');
        } else {
          // Initialize with static portfolio defaults
          setFormData({
            name: staticData.personalInfo?.name || 'Abdul Munim',
            headline: staticData.heroContent?.titleHighlight || 'Full Stack & Java Developer',
            shortBio: staticData.personalInfo?.summary || '',
            aboutDescription: staticData.aboutContent?.bio || '',
            location: staticData.personalInfo?.location || 'Bhopal, India',
            email: staticData.personalInfo?.emails?.primary || '',
            profileImageUrl: '',
            profileImagePath: '',
            githubUrl: '',
            linkedinUrl: '',
            twitterUrl: '',
            instagramUrl: staticData.socialLinks?.instagram || '',
            youtubeUrl: '',
            websiteUrl: '',
          });
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
        setErrorMessage('Failed to load profile data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      validateImage(file, 10);
      setSelectedImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setErrorMessage('');
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleRemoveImage = async () => {
    if (formData.profileImagePath) {
      try {
        await deleteFile(formData.profileImagePath);
      } catch (e) {
        console.warn('Could not delete old image file:', e);
      }
    }
    setSelectedImageFile(null);
    setImagePreview('');
    setFormData((prev) => ({
      ...prev,
      profileImageUrl: '',
      profileImagePath: '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    setIsSaving(true);

    try {
      let finalImageUrl = formData.profileImageUrl;
      let finalImagePath = formData.profileImagePath;

      // If user uploaded a new profile image
      if (selectedImageFile) {
        if (formData.profileImagePath) {
          try {
            await deleteFile(formData.profileImagePath);
          } catch (e) {
            console.warn('Could not delete old image file:', e);
          }
        }

        const uploadResult = await uploadFile(selectedImageFile, 'profile');
        finalImageUrl = uploadResult.downloadUrl;
        finalImagePath = uploadResult.storagePath;
      }

      const updated = {
        ...formData,
        profileImageUrl: finalImageUrl,
        profileImagePath: finalImagePath,
      };

      await updateProfile(updated);
      setFormData(updated);
      setSelectedImageFile(null);
      setSuccessMessage('About & profile information updated successfully!');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      console.error('Failed to save profile:', err);
      setErrorMessage(err.message || 'Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="w-8 h-8 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="pb-6 border-b border-white/10">
        <h1 className="text-3xl font-black text-white tracking-tight">About & Profile</h1>
        <p className="text-white/60 text-sm mt-1">
          Manage your personal biography, headline, contact info, and social destinations
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

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm flex items-center gap-3">
          <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Avatar Section */}
        <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 shadow-lg space-y-4">
          <h2 className="text-base font-bold text-white">Profile Avatar / ID Badge Image</h2>
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-black/60 border border-white/10 shrink-0 flex items-center justify-center">
              {imagePreview ? (
                <img src={imagePreview} alt="Avatar" className="w-full h-full object-cover" onError={() => {}} />
              ) : (
                <span className="text-2xl text-white/40">👤</span>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-white/70">
                Avatar Image URL
              </label>
              <input
                type="text"
                value={formData.profileImageUrl}
                onChange={(e) => {
                  setFormData({ ...formData, profileImageUrl: e.target.value });
                  setImagePreview(e.target.value);
                }}
                placeholder="https://... (Imgur, Cloudinary, GitHub, etc.) or leave blank for local avatar"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500"
                disabled={isSaving}
              />
              <p className="text-[11px] text-white/40">
                Enter any direct image link to update your avatar badge. Leave blank to use the default portfolio avatar.
              </p>
            </div>
          </div>
        </div>

        {/* General Information */}
        <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 shadow-lg space-y-4">
          <h2 className="text-base font-bold text-white">General Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500"
                disabled={isSaving}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                Headline / Title
              </label>
              <input
                type="text"
                value={formData.headline}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500"
                disabled={isSaving}
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
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500"
                disabled={isSaving}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                Contact Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500"
                disabled={isSaving}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
              Short Bio / Summary
            </label>
            <textarea
              rows={3}
              value={formData.shortBio}
              onChange={(e) => setFormData({ ...formData, shortBio: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500 resize-none"
              disabled={isSaving}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
              About Section Description (HTML or text)
            </label>
            <textarea
              rows={4}
              value={formData.aboutDescription}
              onChange={(e) => setFormData({ ...formData, aboutDescription: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500 resize-none"
              disabled={isSaving}
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 shadow-lg space-y-4">
          <h2 className="text-base font-bold text-white">Social & External Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                Instagram URL
              </label>
              <input
                type="url"
                value={formData.instagramUrl}
                onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                placeholder="https://instagram.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500"
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
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500"
                disabled={isSaving}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500"
                disabled={isSaving}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                Twitter / X URL
              </label>
              <input
                type="url"
                value={formData.twitterUrl}
                onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                placeholder="https://x.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500"
                disabled={isSaving}
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-all shadow-lg shadow-red-600/30 flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving && (
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAbout;
