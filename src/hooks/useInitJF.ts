import { useEffect } from 'react';

import { useOption } from './useOption';

export function useInitJF() {
  const apiKey = useOption('jfApiKey');
  useEffect(() => {
    if (!window.JF?.getAPIKey()) {
      window.JF?.initialize({ apiKey });
    }
  }, [apiKey]);
}
