// FIX: Import Dispatch and SetStateAction to be used in function signature.
import { useState, useEffect, Dispatch, SetStateAction } from 'react';

// FIX: Replaced React.Dispatch and React.SetStateAction with imported types in the return type annotation.
function useLocalStorage<T,>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  // Effect to update local storage when state changes in the current tab
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.log(error);
    }
  }, [key, storedValue]);

  // Effect to listen for changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        try {
          if (e.newValue) {
            setStoredValue(JSON.parse(e.newValue));
          } else {
            // The key was cleared in another tab
            setStoredValue(initialValue);
          }
        } catch (error) {
          console.log(`Error parsing storage event value for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, initialValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;