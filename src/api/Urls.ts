const BASE = '/wp-json/um-configurator/v1';

export const Urls = {
  orders: (page: number, pageSize: number) =>
    `${BASE}/order/all?posts_per_page=${pageSize}&paged=${page}&order=DESC&orderby=ID`,

  orderSearch: (search: string) => `${BASE}/order/all?s=${search}`,

  orderById: (id: string | number = ''): string => `${BASE}/order/${id}`,

  options: (name = '') => `${BASE}/options/${name}`,

  services: (id = 'all') => `${BASE}/service/${id}`,

  categories: (id = 'all') => `${BASE}/item-category/${id}`,

  items: (id = 'all') => `${BASE}/item/${id}`,
};
