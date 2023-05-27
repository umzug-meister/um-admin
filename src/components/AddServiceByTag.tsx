import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { AppDispatch } from '../store';
import { createAppService } from '../store/servicesReducer';
import AddButton from './shared/AddButton';

import { AppServiceTag } from 'um-types';

interface Props {
  tag: AppServiceTag;
}
export function AddServiceByTag({ tag }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const onClick = useCallback(() => {
    dispatch(createAppService(tag));
  }, [dispatch]);

  return <AddButton onClick={onClick} />;
}
