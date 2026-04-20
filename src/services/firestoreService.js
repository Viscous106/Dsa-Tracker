/**
 * firestoreService.js
 *
 * CRUD layer for Firestore — wraps all database operations.
 * Separation of concerns: components/contexts never import Firestore directly.
 *
 * Collection structure:
 *   users/{uid}/progress  — single document per user
 *
 * Operations demonstrated:
 *   CREATE / UPDATE  → saveProgress  (setDoc with merge)
 *   READ             → loadProgress  (getDoc)
 *   DELETE           → deleteProgress (deleteDoc)
 */

import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';

// ── Path helpers ────────────────────────────────────────────────────────────
const progressRef = (uid) => doc(db, 'users', uid, 'progress', 'data');

// ── CREATE / UPDATE ─────────────────────────────────────────────────────────
/**
 * Upsert user progress to Firestore.
 * Uses merge:true so partial updates don't wipe unrelated fields.
 */
export async function saveProgress(uid, progress) {
  await setDoc(progressRef(uid), {
    ...progress,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

// ── READ ────────────────────────────────────────────────────────────────────
/**
 * Load user progress from Firestore.
 * Returns null if no document exists yet (new user).
 */
export async function loadProgress(uid) {
  const snap = await getDoc(progressRef(uid));
  if (!snap.exists()) return null;
  const data = snap.data();
  // Remove Firestore-only fields before returning to app state
  const { updatedAt, ...progress } = data;
  return progress;
}

// ── DELETE ──────────────────────────────────────────────────────────────────
/**
 * Delete (reset) user progress from Firestore.
 * Called when the user presses "Reset Progress" in Profile.
 */
export async function deleteProgress(uid) {
  await deleteDoc(progressRef(uid));
}
