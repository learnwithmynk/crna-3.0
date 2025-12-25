/**
 * usePersistentState - useState that persists to localStorage
 *
 * Handles JSON serialization/deserialization and error recovery.
 * Listens for storage events to sync state across browser tabs.
 * Replaces manual localStorage read/write patterns found in:
 * - useSchools.js (savedSchoolIds, targetSchoolIds)
 * - DashboardPage.jsx (onboarding dismissed state)
 * - SchoolDatabasePage.jsx (various states)
 *
 * @example
 * // Basic usage - same API as useState
 * const [savedIds, setSavedIds] = usePersistentState('my_key', []);
 *
 * // With custom serialization (rare)
 * const [state, setState] = usePersistentState('key', initialValue, {
 *   serialize: JSON.stringify,
 *   deserialize: JSON.parse
 * });
 */

import { useState, useEffect } from 'react';

/**
 * @param {string} key - localStorage key
 * @param {T} initialValue - Default value if nothing in storage
 * @param {object} options - Optional serialization overrides
 * @returns {[T, (value: T | ((prev: T) => T)) => void]}
 */
export function usePersistentState(key, initialValue, options = {}) {
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
  } = options;

  // Initialize state from localStorage or use initial value
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored === null) return initialValue;
      return deserialize(stored);
    } catch (err) {
      console.warn(`usePersistentState: Failed to read "${key}"`, err);
      return initialValue;
    }
  });

  // Persist to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(key, serialize(state));
    } catch (err) {
      console.warn(`usePersistentState: Failed to write "${key}"`, err);
    }
  }, [key, state, serialize]);

  // Listen for cross-tab storage events only
  useEffect(() => {
    const handleStorageChange = (event) => {
      // Only handle events for our key
      if (event.key !== key) return;

      try {
        const newValue = event.newValue === null ? initialValue : deserialize(event.newValue);
        setState(newValue);
      } catch (err) {
        console.warn(`usePersistentState: Failed to sync "${key}"`, err);
      }
    };

    // Listen for cross-tab changes only (storage event doesn't fire for same-tab changes)
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, initialValue, deserialize]);

  return [state, setState];
}

/**
 * Clear a persisted state key from localStorage
 * Useful for reset/logout scenarios
 *
 * @param {string} key - localStorage key to remove
 */
export function clearPersistedState(key) {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.warn(`clearPersistedState: Failed to remove "${key}"`, err);
  }
}

export default usePersistentState;
