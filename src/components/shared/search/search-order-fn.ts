import { Urls } from '../../../api/Urls';
import { appRequest } from '../../../api/fetch-client';

import { Order } from '@umzug-meister/um-core';

export function searchOrder(onFinally?: () => void) {
  return function (searchValue: string): Promise<Order[]> {
    const url = isNaN(Number(searchValue)) ? Urls.orderSearch(searchValue) : Urls.orderById(searchValue);

    return appRequest('GET')(url)
      .then((result) => (Array.isArray(result) ? result : [result]))

      .catch((e) => {
        console.error(e);
        return [];
      })

      .finally(onFinally);
  };
}
