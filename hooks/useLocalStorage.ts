import React, { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    // Check if localStorage has been used before for this key
    if (typeof window !== 'undefined' && window.localStorage.getItem('medusa_initialized')) {
        try {
            const item = window.localStorage.getItem(key);
            // If item exists, parse it. If not, use initial value.
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    }
    // If it's the first time ever, use the initial demo data
    return initialValue;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}