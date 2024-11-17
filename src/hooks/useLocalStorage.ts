import { useEffect, useState } from 'react';

export function useLocalStorage(storageKey: string) {
  const [value, setValue] = useState(
    JSON.parse(
      //@ts-ignore
      localStorage.getItem(storageKey),
    ),
  );

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(value));
  }, [value, storageKey]);

  return [value, setValue];
}
