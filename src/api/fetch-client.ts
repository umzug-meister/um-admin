import axios from 'axios';

export const appRequest = (type: 'get' | 'delete' | 'put' | 'post') => {
  const defaultHeaders: any = {};

  if (window.UMCONFUrls?.nonce) {
    defaultHeaders['X-WP-NONCE'] = window.UMCONFUrls.nonce;
  }

  switch (type) {
    case 'get':
      return (url: string) => axios.get(url, { headers: defaultHeaders }).then((res) => res.data);
    case 'delete':
      return (url: string) => axios.delete(url, { headers: defaultHeaders });
    case 'put':
      return (url: string, data?: any) => axios.put(url, data, { headers: defaultHeaders }).then((res) => res.data);
    case 'post':
      return (url: string, data?: any, customHeaders = defaultHeaders) => {
        return axios.post(url, data, { headers: customHeaders }).then((res) => res.data);
      };
  }
};
