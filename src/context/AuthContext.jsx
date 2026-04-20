/**
 * AuthContext.jsx
 *
 * Real Firebase Authentication wired with:
 *  - onAuthStateChanged (useEffect) for persistent session
 *  - signup (createUserWithEmailAndPassword + updateProfile)
 *  - login  (signInWithEmailAndPassword)
 *  - logout (signOut)
 *  - resetPassword (sendPasswordResetEmail)
 *
 * Demonstrates: createContext, useContext, useEffect, useState
 */

import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../config/firebase';

const AuthContext = createContext(null);

// Google provider instance (created once, reused)
const googleProvider = new GoogleAuthProvider();

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Persist session across page refreshes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // ── Email / Password ────────────────────────────────────────────────────────
  const signup = async (email, password, displayName) => {
    const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(newUser, { displayName });
    return newUser;
  };

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  // ── Google OAuth ─────────────────────────────────────────────────────────────
  const loginWithGoogle = () => signInWithPopup(auth, googleProvider);

  // ── Common ───────────────────────────────────────────────────────────────────
  const logout        = () => signOut(auth);
  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  const value = { user, loading, signup, login, loginWithGoogle, logout, resetPassword };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
