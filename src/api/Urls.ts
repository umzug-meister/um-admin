const UM_API = '/wp-json/um-configurator/v1';

type IdType = string | number;

export const Urls = {
  orders: (page: number, pageSize: number) =>
    `${UM_API}/order/all?posts_per_page=${pageSize}&paged=${page}&order=DESC&orderby=ID`,

  orderSearch: (search: string) => `${UM_API}/order/all?s=${search}`,

  orderById: (id: IdType = ''): string => `${UM_API}/order/${id}`,

  options: (name = '') => `${UM_API}/options/${name}`,

  services: (id: IdType = 'all') => `${UM_API}/service/${id}`,

  categories: (id: IdType = 'all') => `${UM_API}/item-category/${id}`,

  items: (id: IdType = 'all') => `${UM_API}/item/${id}`,
};

export const MailProxyUrls = {
  sendMail: `${import.meta.env.VITE_MAIL_PROXY_URL}/send-mail`,
};
