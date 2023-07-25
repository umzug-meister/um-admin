import { useCallback } from 'react';

import { convertData, generateOrder } from '../utils/generateOrderUtils';
import { useAppFurniture } from './useAppFurniture';
import { useAppServices } from './useAppServices';

import { AppPacking, AppService } from 'um-types';

export function useGenerateOrder() {
  const packing = useAppServices<AppPacking>('Packmaterial');
  const services = useAppServices<AppService>('Bohrarbeiten');
  const allItems = useAppFurniture();

  const generate = useCallback(
    (response: any) => {
      const data = convertData([response]);
      const order = generateOrder(data[0].answers, [...packing, ...services], allItems);
      return order;
    },
    [packing, services, allItems],
  );
  return generate;
}
