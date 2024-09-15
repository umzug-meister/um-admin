import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { countOrders } from '../store/servicesReducer';
import { useCurrentOrder } from './useCurrentOrder';
import { AppDispatch } from '../store';

export function useUpdateCounter() {
  const dispatch = useDispatch<AppDispatch>();

  const order = useCurrentOrder();
  const { id } = useParams();

  useEffect(() => {
    if (order == null || order.isCopyOf || id == '-1') return;

    console.log('will update counter');

    dispatch(countOrders({ id: Number(id), src: order.src }));
  }, [order, id]);
}
