/**
 * useLocalStorage.js
 *
 * Generic localStorage hook — reads, writes, and stays in sync.
 * Falls back gracefully if localStorage is unavailable (SSR, private mode).
 *
 * Demonstrates: useState, useCallback, generic hooks pattern
 */

import { useState, useCallback } from 'react';

/**
 * @param {string} key          — localStorage key
 * @param {*}      initialValue — default value if key doesn't exist
 * @returns [storedValue, setValue, removeValue]
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // useCallback: stable reference so callers don't re-render unnecessarily
  const setValue = useCallback(
    (value) => {
      try {
        // Allow value to be a function (same API as useState)
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`useLocalStorage: error setting key "${key}"`, error);
      }
    },
    [key, storedValue],
  );

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`useLocalStorage: error removing key "${key}"`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
