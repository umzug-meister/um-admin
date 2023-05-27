import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { AppDispatch } from '../store';
import { createUpdateOrder, setOrder } from '../store/appReducer';
import { useNavigateToOrder } from './useNavigateToOrder';

import { Order } from 'um-types';

export function useImportOrder() {
  const dispatch = useDispatch<AppDispatch>();
  const navigateToOrder = useNavigateToOrder();

  const importOrder = useCallback(
    (order: Order) => {
      dispatch(setOrder(order));
      dispatch(createUpdateOrder({ callback: navigateToOrder, id: order.id }));
    },
    [dispatch],
  );

  return importOrder;
}
