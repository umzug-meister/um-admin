import { Order } from 'um-types';
import { appRequest } from '../../../api/fetch-client';
import { Urls } from '../../../api/Urls';

export function useOrderSearch(onFinally: () => void) {
  return function (searchValue: string): Promise<Order[]> {
    const id = Number(searchValue);
    if (isNaN(id)) {
      return appRequest('get')(Urls.orderSearch(searchValue))
        .then((orders) => {
          if (Array.isArray(orders)) {
            return orders;
          } else {
            return [];
          }
        })
        .finally(onFinally);
    } else {
      return appRequest('get')(Urls.orderById(id))
        .then((order) => {
          if (order) {
            return [order];
          } else {
            return [];
          }
        })
        .catch((e) => {
          console.error(e);
          return [];
        })
        .finally(onFinally);
    }
  };
}
