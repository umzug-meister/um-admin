export namespace Urls {
  export const orders = (page: number, pageSize: number) =>
    `/order/all?posts_per_page=${pageSize}&paged=${page}&order=DESC&orderby=ID`;
  export const orderSearch = (search: string) => `/order/all?s=${search}`;
  export const orderById = (id: string | number = ''): string => `/order/${id}`;

  export const options = (name = '') => `/options/${name}`;

  export const services = (id = 'all') => {
    return `/service/${id}`;
  };

  export const categories = (id = 'all') => {
    return `/item-category/${id}`;
  };

  export const items = (id = 'all') => {
    return `item/${id}`;
  };
}
