const BASE = '/wp-json/um-configurator/v1';

type IdType = string | number;

export const Urls = {
  orders: (page: number, pageSize: number) =>
    `${BASE}/order/all?posts_per_page=${pageSize}&paged=${page}&order=DESC&orderby=ID`,

  orderSearch: (search: string) => `${BASE}/order/all?s=${search}`,

  orderById: (id: IdType = ''): string => `${BASE}/order/${id}`,

  options: (name = '') => `${BASE}/options/${name}`,

  services: (id: IdType = 'all') => `${BASE}/service/${id}`,

  categories: (id: IdType = 'all') => `${BASE}/item-category/${id}`,

  items: (id: IdType = 'all') => `${BASE}/item/${id}`,
};
