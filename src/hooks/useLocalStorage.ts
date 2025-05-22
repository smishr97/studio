
"use client";

import { useState, useEffect, useCallback } from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Initialize state.
  // Read from localStorage only on the client and only once for initialization.
  const [storedValue, setStoredValue] = useState<T>(() => {
    // Check if running on the client
    if (typeof window === 'undefined') {
      return initialValue; // For SSR or server environments
    }
    try {
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}" during initialization:`, error);
      return initialValue; // Fallback to initialValue on error
    }
  });

  // Persist to localStorage.
  // This effect runs after every render where `key` or `storedValue` has changed.
  useEffect(() => {
    if (typeof window === 'undefined') {
      return; // Don't run on server
    }
    try {
      // When storedValue is the initialValue and localStorage doesn't have the key yet,
      // this will write the initialValue to localStorage.
      // If storedValue changes due to setValue, this will write the new value.
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]); // Dependencies: re-run if key or the value itself changes.

  // Define the setter function.
  // Use useCallback to ensure the setter function has a stable identity.
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      // `setStoredValue` from useState can take a value or a function that receives the previous state.
      setStoredValue(value);
    },
    [] // Empty dependency array makes `setValue` stable across re-renders.
  );

  return [storedValue, setValue];
}

export default useLocalStorage;
