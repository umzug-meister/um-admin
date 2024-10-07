import { useEffect } from 'react';

export function useSetDocumentTitle(id?: number) {
  useEffect(() => {
    const lastTitle = document.title;

    document.title = `Auftrag ${id ?? 'unbekannt'}`;
    return () => {
      document.title = lastTitle;
    };
  }, [id]);
}
