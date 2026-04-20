import { createContext, useContext, useEffect, useState } from 'react';

// === TEMPORARY MOCK ===
// Bypassing Firebase entirely for temporary testing
// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signOut,
//   onAuthStateChanged,
//   sendPasswordResetEmail,
//   updateProfile,
// } from 'firebase/auth';
// import { auth } from '../config/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Mock a locally authenticated user instantly
  const [user, setUser] = useState({
    uid: 'temp-auth-id-123',
    email: 'localtest@agent.com',
    displayName: 'Local Test Agent'
  });
  const [loading, setLoading] = useState(false);

  const signup = async (email, password, displayName) => {
    console.log('Mock signup:', email);
    return { user: { email, displayName } };
  };

  const login = async (email, password) => {
    console.log('Mock login:', email);
    return { user: { email } };
  };
  
  const logout = () => {
    console.log('Mock logout invoked');
  };
  
  const resetPassword = async (email) => {
    console.log('Mock reset password:', email);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
