import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { isFirebaseConfigured } from '../../firebase/config';

const AdminLogin = () => {
  const { user, login, loginGoogle, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [unauthorizedUid, setUnauthorizedUid] = useState('');
  const [copiedUid, setCopiedUid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // If already logged in and authorized, redirect straight to admin dashboard
  useEffect(() => {
    if (user && isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [user, isAuthenticated, navigate]);

  const handleGoogleSignIn = async () => {
    setError('');
    setUnauthorizedUid('');
    setIsGoogleLoading(true);

    try {
      await loginGoogle();
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message || 'Google Sign-In failed.');
      if (err.unauthorizedUid) {
        setUnauthorizedUid(err.unauthorizedUid);
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUnauthorizedUid('');

    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);

    try {
      await login(email.trim(), password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      if (err.unauthorizedUid) {
        setUnauthorizedUid(err.unauthorizedUid);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyUidToClipboard = () => {
    if (unauthorizedUid) {
      navigator.clipboard.writeText(unauthorizedUid);
      setCopiedUid(true);
      setTimeout(() => setCopiedUid(false), 2000);
    }
  };

  const configured = isFirebaseConfigured();

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background glow */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-red-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-red-400 text-white font-black text-2xl mb-4 shadow-xl shadow-red-600/30">
            A
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Admin Portal</h1>
          <p className="text-white/50 text-sm mt-1">Sign in to manage your portfolio content</p>
        </div>

        {/* Configuration Notice */}
        {!configured && (
          <div className="mb-6 p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-200 text-xs leading-relaxed">
            <span className="font-bold block mb-1">⚠️ Firebase Not Configured:</span>
            Please add your Firebase keys to <code className="bg-black/40 px-1 py-0.5 rounded font-mono">.env.local</code> to enable authentication.
          </div>
        )}

        {/* Card */}
        <div className="bg-[#121212] border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-md">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm space-y-2 animate-fade-in">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="flex-1 leading-snug">{error}</span>
              </div>

              {unauthorizedUid && (
                <div className="pt-2 border-t border-red-500/20 flex items-center justify-between gap-2 text-xs">
                  <span className="font-mono text-white/70 truncate max-w-[220px]">
                    UID: {unauthorizedUid}
                  </span>
                  <button
                    type="button"
                    onClick={copyUidToClipboard}
                    className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white font-mono text-[11px] font-semibold transition-colors shrink-0"
                  >
                    {copiedUid ? '✓ Copied' : 'Copy UID'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Google Sign-In Button */}
          <button
            type="button"
            disabled={isLoading || isGoogleLoading || !configured}
            onClick={handleGoogleSignIn}
            className="w-full py-3.5 px-6 rounded-xl bg-white hover:bg-gray-100 text-gray-900 font-bold text-sm transition-all shadow-md flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isGoogleLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-gray-900" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Connecting to Google...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Sign in with Google</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <span className="relative px-3 bg-[#121212] text-xs font-semibold text-white/40 uppercase tracking-wider">
              Or with Email & Password
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-sm font-medium"
                disabled={isLoading || isGoogleLoading}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-sm font-medium"
                disabled={isLoading || isGoogleLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || isGoogleLoading || !configured}
              className="w-full mt-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white font-bold text-sm hover:from-red-500 hover:to-red-600 transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In with Email</span>
              )}
            </button>
          </form>
        </div>

        {/* Back to public link */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-xs text-white/50 hover:text-white transition-colors inline-flex items-center gap-1.5"
          >
            ← Back to Public Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
