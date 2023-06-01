import { useSelector } from 'react-redux';

import { AppState } from '../store';
import { AppServices } from '../store/servicesReducer';

import { AppServiceTag } from 'um-types';

export function useAppServices<T>(tag?: AppServiceTag): T[] {
  console.log('app services');
  const appServices = useSelector<AppState, AppServices>((s) => s.services);

  if (tag) {
    return (appServices.all as any[]).filter((s) => s.tag === tag) as T[];
  }

  return appServices.all as any;
}
