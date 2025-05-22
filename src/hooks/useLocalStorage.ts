"use client";

import { useState, useEffect, useCallback } from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    // This effect runs only on the client, after hydration
    let valueFromStorage: T;
    try {
      const item = window.localStorage.getItem(key);
      valueFromStorage = item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      valueFromStorage = initialValue;
    }
    setStoredValue(valueFromStorage);

    // If initialValue was used because nothing was in storage, set it.
    if (typeof window !== 'undefined' && !window.localStorage.getItem(key)) {
        window.localStorage.setItem(key, JSON.stringify(initialValue));
    }
  }, [key, initialValue]);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}

export default useLocalStorage;
