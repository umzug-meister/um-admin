import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { AppDispatch } from '../store';
import { createAppService } from '../store/servicesReducer';
import AddButton from './shared/AddButton';

import { Service } from '@umzug-meister/um-core';

interface Props {
  service: Partial<Service>;
}
export function AddService({ service }: Readonly<Props>) {
  const dispatch = useDispatch<AppDispatch>();

  const onClick = useCallback(() => {
    dispatch(createAppService(service));
  }, [dispatch, service]);

  return <AddButton onClick={onClick} />;
}
