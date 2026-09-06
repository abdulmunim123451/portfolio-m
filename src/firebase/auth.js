import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from './config';

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Returns the configured admin UID from environment (if set)
export const getAdminUid = () => {
  return (import.meta.env.VITE_ADMIN_UID || '').trim();
};

// Returns the fallback admin email
export const getAdminEmail = () => {
  return (import.meta.env.VITE_ADMIN_EMAIL || 'abdulmunim1234512345@gmail.com').trim().toLowerCase();
};

// Validates whether the authenticated user is the designated portfolio admin
export const isAuthorizedAdmin = (user) => {
  if (!user) return false;
  const configuredUid = getAdminUid();
  
  // If a specific Admin UID is configured in the environment, enforce it strictly
  if (configuredUid && configuredUid !== 'YOUR_ADMIN_UID_HERE') {
    return user.uid === configuredUid;
  }

  // Fallback: If UID is not configured yet, restrict to the portfolio owner's email
  const adminEmail = getAdminEmail();
  if (adminEmail && user.email) {
    return user.email.trim().toLowerCase() === adminEmail;
  }

  // Otherwise, default to authorized if authenticated
  return true;
};

// Google Sign-In with UID authorization check
export const loginWithGoogle = async () => {
  if (!isFirebaseConfigured() || !auth) {
    throw new Error(
      'Firebase is not configured yet. Please provide your Firebase credentials in .env.local'
    );
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Verify admin authorization
    if (!isAuthorizedAdmin(user)) {
      const unauthorizedEmail = user.email || 'unknown';
      const unauthorizedUid = user.uid;

      // Immediately terminate the unauthorized session
      await signOut(auth);

      const err = new Error(
        `Access Denied: Account "${unauthorizedEmail}" (UID: ${unauthorizedUid}) is not authorized to access this admin portal. Only the designated portfolio administrator UID is permitted.`
      );
      err.code = 'auth/unauthorized-admin';
      err.unauthorizedUid = unauthorizedUid;
      err.unauthorizedEmail = unauthorizedEmail;
      throw err;
    }

    return user;
  } catch (error) {
    if (error.code === 'auth/unauthorized-admin') {
      throw error;
    }

    let friendlyMessage = 'Failed to sign in with Google. Please try again.';
    switch (error.code) {
      case 'auth/popup-closed-by-user':
        friendlyMessage = 'Google sign-in popup was closed before completing.';
        break;
      case 'auth/popup-blocked':
        friendlyMessage = 'Google sign-in popup was blocked by your browser. Please allow popups for this site.';
        break;
      case 'auth/cancelled-popup-request':
        friendlyMessage = 'Google sign-in was cancelled.';
        break;
      case 'auth/network-request-failed':
        friendlyMessage = 'Network error during Google sign-in. Please check your internet connection.';
        break;
      case 'auth/operation-not-allowed':
        friendlyMessage = 'Google Sign-In is not enabled in your Firebase Console (Authentication > Sign-in method).';
        break;
      default:
        friendlyMessage = error.message || friendlyMessage;
    }
    const err = new Error(friendlyMessage);
    err.code = error.code;
    throw err;
  }
};

// Email & Password Sign-In
export const loginAdmin = async (email, password) => {
  if (!isFirebaseConfigured() || !auth) {
    throw new Error(
      'Firebase is not configured yet. Please provide your Firebase credentials in .env.local'
    );
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Verify admin authorization
    if (!isAuthorizedAdmin(user)) {
      const unauthorizedUid = user.uid;
      await signOut(auth);
      const err = new Error(
        `Access Denied: Account (UID: ${unauthorizedUid}) is not authorized for administrator access.`
      );
      err.code = 'auth/unauthorized-admin';
      err.unauthorizedUid = unauthorizedUid;
      throw err;
    }

    return user;
  } catch (error) {
    if (error.code === 'auth/unauthorized-admin') {
      throw error;
    }

    let friendlyMessage = 'Failed to sign in. Please check your credentials.';
    switch (error.code) {
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        friendlyMessage = 'Invalid email or password.';
        break;
      case 'auth/invalid-email':
        friendlyMessage = 'The email address is improperly formatted.';
        break;
      case 'auth/too-many-requests':
        friendlyMessage = 'Too many failed login attempts. Please wait a few minutes.';
        break;
      case 'auth/network-request-failed':
        friendlyMessage = 'Network error. Please check your internet connection.';
        break;
      default:
        friendlyMessage = error.message || friendlyMessage;
    }
    const err = new Error(friendlyMessage);
    err.code = error.code;
    throw err;
  }
};

export const logoutAdmin = async () => {
  if (!auth) return;
  await signOut(auth);
};

export const onAuthChange = (callback) => {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};
