import { useSelector } from 'react-redux';

import { AppState } from '../store';

import { Order } from 'um-types';

export function useCurrentOrder() {
  const order = useSelector<AppState, Order | null>((s) => s.app.current);
  return order;
}
