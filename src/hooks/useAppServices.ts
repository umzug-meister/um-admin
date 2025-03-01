import { useSelector } from 'react-redux';

import { AppServices } from '../app-types';
import { AppState } from '../store';

import { AppServiceTag } from '@umzug-meister/um-core';

export function useAppServices<T>(tag?: AppServiceTag): T[] {
  const appServices = useSelector<AppState, AppServices>((s) => s.services);

  if (tag) {
    return (appServices.all as any[]).filter((s) => s.tag === tag) as T[];
  }

  return appServices.all as any;
}
