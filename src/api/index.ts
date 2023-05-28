import axios from 'axios';

const base = '/wp-json/um-configurator/v1';
function initBaseURL() {
  if (!axios.defaults.baseURL) {
    axios.defaults.baseURL = (process.env.REACT_APP_WP_HOST || '') + base;
  }
}

export const appRequest = (type: 'get' | 'delete' | 'put' | 'post') => {
  const headers: any = {};

  if (window.UMCONFUrls?.nonce) {
    headers['X-WP-NONCE'] = window.UMCONFUrls.nonce;
  }
  initBaseURL();

  switch (type) {
    case 'get':
      return (url: string) => axios.get(url, { headers }).then((res) => res.data);

    case 'delete':
      return (url: string) => axios.delete(url);
    case 'put':
      return (url: string, data?: any) => axios.put(url, data, { headers }).then((res) => res.data);
    case 'post':
      return (url: string, data?: any) => axios.post(url, data, { headers }).then((res) => res.data);
  }
};
