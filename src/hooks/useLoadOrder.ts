import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { AppDispatch, AppState } from '../store';
import { initOrder, loadOrder } from '../store/appReducer';

import { Order } from '@umzug-meister/um-core';

export function useLoadOrder() {
  const { id } = useParams<'id'>();
  console.log('id', id);

  const dispatch = useDispatch<AppDispatch>();
  const order = useSelector<AppState, Order | null | undefined>((s) => s.app.current);

  useEffect(() => {
    if (id && Number(id) !== -1) {
      dispatch(loadOrder(id));
    }

    if (Number(id) === -1) {
      dispatch(initOrder());
    }
  }, [id, dispatch]);

  return order;
}
