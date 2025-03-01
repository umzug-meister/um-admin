import { useSelector } from 'react-redux';

import { AppState } from '../store';

import { Furniture } from '@umzug-meister/um-core';

export function useAppFurniture() {
  const furniture = useSelector<AppState, Furniture[]>((s) => s.furniture.all);

  const sorted = [...furniture].sort((a, b) => Number(a.sortOrder || 1000) - Number(b.sortOrder || 1000));
  return sorted;
}
