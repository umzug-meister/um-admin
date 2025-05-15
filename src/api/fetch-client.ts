export const appRequest = (httpMethod: 'GET' | 'DELETE' | 'PUT' | 'POST') => {
  const defaultHeaders: Record<string, string> = {};

  if (window.UMCONFUrls?.nonce) {
    defaultHeaders['X-WP-NONCE'] = window.UMCONFUrls.nonce;
  }

  const handleResponse = async (response: Response) => {
    if (!response.ok) {
      const errorBody = await response.json();

      alert(`Fehler: ${errorBody.message}`);
      return null;
    }
    if (response.headers.get('Content-Type')?.includes('application/json')) {
      return response.json();
    } else return response.text();
  };

  switch (httpMethod) {
    case 'GET':
    case 'DELETE':
      return async (url: string) => {
        const response = await fetch(url, {
          method: httpMethod,
          headers: defaultHeaders,
        });
        return handleResponse(response);
      };

    case 'PUT':
      return async (url: string, data?: any) => {
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            ...defaultHeaders,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        return handleResponse(response);
      };

    case 'POST':
      return async (url: string, data?: any, customHeaders = defaultHeaders) => {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            ...customHeaders,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        return handleResponse(response);
      };
  }
};
