
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { onAuthStateChangedWrapper, signInWithEmailAndPassword, signUpWithEmailAndPassword } from '~/services/firebaseService';
import { auth } from '~/lib/firebase';
import KizunaLoading from '~/components/ui/KizunaLoading';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const hasRedirected = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedWrapper((user) => {
      console.log('[AuthProvider] onAuthStateChanged user:', user ? (user as any).uid : 'null');
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Reset hasRedirected when location changes
  useEffect(() => {
    hasRedirected.current = false;
  }, [location.pathname]);

  // (Global redirect logic removed. Use page-level guards instead.)

  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(email, password);
    return result;
  };

  const signup = async (email, password) => {
    const result = await signUpWithEmailAndPassword(email, password);
    return result;
  };

  const logout = async () => {
    return await auth.signOut();
  };

  const value = { user, loading, login, signup, logout };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <KizunaLoading /> : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
