import { useSelector } from 'react-redux';

import { AppState } from '../store';

import { Category } from '@umzug-meister/um-core';

export function useCategories() {
  const categories = useSelector<AppState, Category[]>((s) => s.categories.all);
  return categories;
}
