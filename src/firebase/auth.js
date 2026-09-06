import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from './config';

export const loginAdmin = async (email, password) => {
  if (!isFirebaseConfigured() || !auth) {
    throw new Error(
      'Firebase is not configured yet. Please provide your Firebase credentials in .env.local'
    );
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
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
