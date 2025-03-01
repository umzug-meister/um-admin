import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { AppDispatch, AppState } from '../store';
import { initOrder, loadOrder } from '../store/appReducer';

import { Order } from '@umzug-meister/um-core';

export function useLoadOrder() {
  const order = useSelector<AppState, Order | null | undefined>((s) => s.app.current);
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (params.id && Number(params.id) !== -1) {
      dispatch(loadOrder(params.id));
    }

    if (Number(params.id) === -1) {
      dispatch(initOrder());
    }
  }, [params, dispatch]);

  return order;
}
