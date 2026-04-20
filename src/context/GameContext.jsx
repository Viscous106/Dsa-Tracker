/**
 * GameContext.jsx
 *
 * Manages DSA progress with:
 *  - useReducer  — predictable state transitions
 *  - useEffect   — (1) Firestore load on login, (2) debounced Firestore save on change
 *  - useMemo     — stable context value reference (prevents unnecessary re-renders)
 *  - localStorage — offline fallback so progress is never lost on network issues
 *
 * Firestore sync pattern:
 *   READ  on mount  → hydrate from Firestore (overrides localStorage if newer)
 *   WRITE on change → debounced 800ms write to Firestore
 *   DELETE on reset → clears Firestore document
 */

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import { userProgressReducer, initialDsaProgress } from '../reducers';
import { saveProgress, loadProgress, deleteProgress } from '../services/firestoreService';
import { useAuth } from './AuthContext';

const GameContext = createContext(null);
const STORAGE_KEY = 'dsaveda_progress';

// ── Helpers ──────────────────────────────────────────────────────────────────

function readLocalStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function writeLocalStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch { /* ignore quota errors */ }
}

// ─────────────────────────────────────────────────────────────────────────────

export function GameProvider({ children }) {
  const { user } = useAuth();

  // Initialise from localStorage so the app feels instant on load
  const [progress, dispatch] = useReducer(
    userProgressReducer,
    initialDsaProgress,
    () => readLocalStorage() ?? initialDsaProgress,
  );

  // useRef to hold the debounce timer — doesn't cause re-renders
  const saveTimerRef = useRef(null);

  // ── EFFECT 1: Load from Firestore when user logs in ────────────────────────
  // Demonstrates: useEffect with dependency on user UID
  useEffect(() => {
    if (!user?.uid) return;

    loadProgress(user.uid).then((firestoreData) => {
      if (!firestoreData) return; // brand new user — nothing to load
      // Replace local state with Firestore data (source of truth)
      dispatch({ type: 'HYDRATE', payload: firestoreData });
      writeLocalStorage(firestoreData);
    }).catch(console.error);
  }, [user?.uid]);

  // ── EFFECT 2: Persist to localStorage + debounced Firestore save ───────────
  // Demonstrates: useEffect cleanup (clearTimeout) — the "useDebounce" pattern
  useEffect(() => {
    // Always sync to localStorage immediately (offline-first)
    writeLocalStorage(progress);

    // Debounce Firestore writes by 800ms to avoid hitting write limits
    if (!user?.uid) return;

    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveProgress(user.uid, progress).catch(console.error);
    }, 800);

    // Cleanup: cancel pending write if progress changes again within 800ms
    return () => clearTimeout(saveTimerRef.current);
  }, [progress, user?.uid]);

  // ── Stable context value (useMemo prevents needless child re-renders) ───────
  const value = useMemo(
    () => ({
      progress,
      dispatch,
      // Expose reset so Profile can also clear Firestore
      resetProgress: async () => {
        dispatch({ type: 'RESET' });
        if (user?.uid) {
          await deleteProgress(user.uid).catch(console.error);
        }
      },
    }),
    [progress, user?.uid],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside <GameProvider>');
  return ctx;
}
