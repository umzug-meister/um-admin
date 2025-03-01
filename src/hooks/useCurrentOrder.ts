import { useSelector } from 'react-redux';

import { AppState } from '../store';

import { Order } from '@umzug-meister/um-core';

export function useCurrentOrder() {
  const order = useSelector<AppState, Order | null>((s) => s.app.current);
  return order;
}
