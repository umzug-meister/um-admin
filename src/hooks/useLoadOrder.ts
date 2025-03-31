import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { AppDispatch, AppState } from '../store';
import { initOrder, loadOrder } from '../store/appReducer';

import { Order } from '@umzug-meister/um-core';

export function useLoadOrder() {
  const { id } = useParams<{ id?: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const order = useSelector<AppState, Order | null>((s) => s.app.current);

  const numericId = id ? Number(id) : null;

  useEffect(() => {
    if (numericId !== null && numericId !== -1) {
      dispatch(loadOrder(numericId));
    } else if (numericId === -1) {
      dispatch(initOrder());
    }
  }, [numericId]);

  return order;
}
