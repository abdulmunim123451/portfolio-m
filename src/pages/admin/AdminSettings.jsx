import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { seedInitialData } from '../../firebase/firestore';
import * as staticPortfolioData from '../../data/portfolioData';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const AdminSettings = () => {
  const { user, logout } = useAuth();
  const [copiedUid, setCopiedUid] = useState(false);

  // Seed state
  const [replaceExisting, setReplaceExisting] = useState(false);
  const [seedConfirmOpen, setSeedConfirmOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState(null);
  const [seedError, setSeedError] = useState('');

  const copyUidToClipboard = () => {
    if (user?.uid) {
      navigator.clipboard.writeText(user.uid);
      setCopiedUid(true);
      setTimeout(() => setCopiedUid(false), 2500);
    }
  };

  const handleRunSeed = async () => {
    setIsSeeding(true);
    setSeedError('');
    setSeedResult(null);

    try {
      const results = await seedInitialData(staticPortfolioData, {
        replaceExisting,
      });
      setSeedResult(results);
      setSeedConfirmOpen(false);
    } catch (err) {
      console.error('Seed error:', err);
      setSeedError(err.message || 'Failed to seed initial data.');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="pb-6 border-b border-white/10">
        <h1 className="text-3xl font-black text-white tracking-tight">System & Account Settings</h1>
        <p className="text-white/60 text-sm mt-1">
          Review your administrator credentials, configure security rules UID, and seed portfolio data
        </p>
      </div>

      {/* Account Info Card */}
      <div className="p-6 md:p-8 rounded-2xl bg-[#141414] border border-white/10 shadow-lg space-y-6">
        <h2 className="text-base font-bold text-white">Administrator Account</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-white/40 font-bold">
              Email Address
            </span>
            <p className="text-sm font-semibold text-white truncate">{user?.email || 'N/A'}</p>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-white/40 font-bold">
              Account Status
            </span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <p className="text-sm font-semibold text-green-400">Authenticated Administrator</p>
            </div>
          </div>
        </div>

        {/* UID Display with One-Click Copy */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono tracking-wider text-white/40 font-bold">
              Your Firebase Admin UID
            </span>
            <span className="text-[11px] text-red-400 font-medium">Use in firestore.rules & storage.rules</span>
          </div>
          <div className="flex items-center gap-3">
            <code className="flex-1 px-3 py-2 rounded-lg bg-white/5 text-xs font-mono text-white/90 truncate border border-white/10">
              {user?.uid || 'Not available'}
            </code>
            <button
              type="button"
              onClick={copyUidToClipboard}
              className="px-4 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5"
            >
              {copiedUid ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  Copy UID
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-white/40 pt-1">
            Replace <code className="text-white/60 font-mono">YOUR_ADMIN_UID_HERE</code> in <code className="text-white/60 font-mono">firestore.rules</code> and <code className="text-white/60 font-mono">storage.rules</code> with this UID to lock down database permissions.
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={logout}
            className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-semibold transition-colors border border-white/10"
          >
            Sign Out of Console
          </button>
        </div>
      </div>

      {/* Database Seeding Tool Card */}
      <div className="p-6 md:p-8 rounded-2xl bg-[#141414] border border-white/10 shadow-lg space-y-5">
        <div>
          <h2 className="text-base font-bold text-white">Seed Initial Content from Portfolio</h2>
          <p className="text-xs text-white/60 mt-1 leading-relaxed max-w-2xl">
            Populate Cloud Firestore with all the hardcoded projects, technical skills, about info, experience, certificates, and resume from your current portfolio. By default, this is <strong>safe and non-destructive</strong>: it only adds items that don't already exist in Firestore.
          </p>
        </div>

        {seedResult && (
          <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-300 text-xs space-y-1">
            <p className="font-bold text-sm">Data migration completed successfully!</p>
            <ul className="list-disc pl-5 space-y-0.5 pt-1 text-green-200">
              <li>Projects added: {seedResult.projectsAdded}</li>
              <li>Skills added: {seedResult.skillsAdded}</li>
              <li>Experience items added: {seedResult.experienceAdded}</li>
              <li>Certificates added: {seedResult.certificatesAdded}</li>
              <li>Profile updated: {seedResult.profileUpdated ? 'Yes' : 'Skipped (already exists)'}</li>
              <li>Resume updated: {seedResult.resumeUpdated ? 'Yes' : 'Skipped (already exists)'}</li>
              {seedResult.skippedCount > 0 && (
                <li>Existing documents preserved without overwrite: {seedResult.skippedCount}</li>
              )}
            </ul>
          </div>
        )}

        {seedError && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
            {seedError}
          </div>
        )}

        {/* Safety checkbox */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-start gap-3">
          <input
            type="checkbox"
            id="replaceExistingCheckbox"
            checked={replaceExisting}
            onChange={(e) => setReplaceExisting(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-white/20 bg-black/40 text-red-500 focus:ring-0 cursor-pointer"
          />
          <label htmlFor="replaceExistingCheckbox" className="text-xs text-white/70 cursor-pointer select-none leading-relaxed">
            <span className="font-bold text-white block">Replace existing data</span>
            When checked, existing documents with matching titles/names will be overwritten. Leave unchecked to safely skip existing documents.
          </label>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setSeedConfirmOpen(true)}
            className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-all shadow-md shadow-red-600/30 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Seed Portfolio Data to Firestore
          </button>
        </div>
      </div>

      {/* Seed Confirmation Dialog */}
      <ConfirmDialog
        isOpen={seedConfirmOpen}
        title="Confirm Data Migration"
        message={
          replaceExisting
            ? 'WARNING: You have enabled "Replace existing data". Any existing documents with matching titles in Firestore will be overwritten with portfolioData defaults. Are you sure you want to proceed?'
            : 'This will copy the initial projects, skills, about info, experience, and certificates into Firestore. Existing documents will be safely preserved and NOT overwritten. Proceed?'
        }
        confirmText={replaceExisting ? 'Proceed with Overwrite' : 'Proceed Safely'}
        cancelText="Cancel"
        isDestructive={replaceExisting}
        isLoading={isSeeding}
        onConfirm={handleRunSeed}
        onCancel={() => setSeedConfirmOpen(false)}
      />
    </div>
  );
};

export default AdminSettings;
