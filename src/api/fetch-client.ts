import axios from 'axios';

export const appRequest = (type: 'get' | 'delete' | 'put' | 'post') => {
  const headers: any = {};

  if (window.UMCONFUrls?.nonce) {
    headers['X-WP-NONCE'] = window.UMCONFUrls.nonce;
  }

  switch (type) {
    case 'get':
      return (url: string) => axios.get(url, { headers }).then((res) => res.data);

    case 'delete':
      return (url: string) => axios.delete(url, { headers });
    case 'put':
      return (url: string, data?: any) => axios.put(url, data, { headers }).then((res) => res.data);
    case 'post':
      return (url: string, data?: any) => axios.post(url, data, { headers }).then((res) => res.data);
  }
};
