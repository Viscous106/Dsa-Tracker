/**
 * useDebounce.js
 *
 * Returns a debounced version of `value` that only updates after
 * `delay` ms of inactivity. Prevents expensive operations (search
 * filtering, Firestore writes) from firing on every keystroke.
 *
 * Demonstrates: useEffect, useState, cleanup functions
 */

import { useEffect, useState } from 'react';

/**
 * @param {*}      value — the value to debounce
 * @param {number} delay — milliseconds to wait (default: 350ms)
 * @returns debounced value
 */
export function useDebounce(value, delay = 350) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Schedule the update
    const timer = setTimeout(() => setDebouncedValue(value), delay);

    // Cleanup: cancel the timer if value changes before delay elapses
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
