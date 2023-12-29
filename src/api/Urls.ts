const base = '/wp-json/um-configurator/v1';

export namespace Urls {
  export const orders = (page: number, pageSize: number) =>
    `${base}/order/all?posts_per_page=${pageSize}&paged=${page}&order=DESC&orderby=ID`;
  export const orderSearch = (search: string) => `${base}/order/all?s=${search}`;
  export const orderById = (id: string | number = ''): string => `${base}/order/${id}`;

  export const options = (name = '') => `${base}/options/${name}`;

  export const services = (id = 'all') => {
    return `${base}/service/${id}`;
  };

  export const categories = (id = 'all') => {
    return `${base}/item-category/${id}`;
  };

  export const items = (id = 'all') => {
    return `${base}/item/${id}`;
  };
}
