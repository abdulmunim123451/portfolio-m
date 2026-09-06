import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  loginAdmin,
  loginWithGoogle,
  logoutAdmin,
  onAuthChange,
  isAuthorizedAdmin,
  getAdminUid,
} from '../firebase/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((currentUser) => {
      if (currentUser) {
        if (isAuthorizedAdmin(currentUser)) {
          setUser(currentUser);
        } else {
          // If a logged-in user is not authorized, sign them out safely
          logoutAdmin();
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    const loggedInUser = await loginAdmin(email, password);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const loginGoogle = async () => {
    const loggedInUser = await loginWithGoogle();
    setUser(loggedInUser);
    return loggedInUser;
  };

  const logout = async () => {
    await logoutAdmin();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginGoogle,
        logout,
        isAuthenticated: Boolean(user && isAuthorizedAdmin(user)),
        configuredAdminUid: getAdminUid(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
