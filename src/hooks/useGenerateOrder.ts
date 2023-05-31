import { useCallback } from 'react';

import { convertData, generateOrder } from '../utils/generateOrderUtils';
import { useAppFurniture } from './useAppFurniture';
import { useAppServices } from './useAppServices';
import { useCategories } from './useCategories';

import { AppPacking, AppService } from 'um-types';

export function useGenerateOrder() {
  const packing = useAppServices<AppPacking>('Price');
  const services = useAppServices<AppService>('Bohrarbeiten');
  const allItems = useAppFurniture();
  const cats = useCategories();

  const generate = useCallback(
    (response: any) => {
      const data = convertData([response]);
      const order = generateOrder(data[0].answers, [...packing, ...services], allItems, cats);
      return order;
    },
    [packing, services, allItems, cats],
  );
  return generate;
}
