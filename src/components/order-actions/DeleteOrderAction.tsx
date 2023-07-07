import { Tooltip } from '@mui/material';

import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { AppDispatch } from '../../store';
import { deleteOrder } from '../../store/appReducer';
import { DeleteButton } from '../shared/DeleteButton';

export function DeleteOrderAction() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleDelete = useCallback(() => {
    if (window.confirm('Auftrag wirklich löschen?')) {
      dispatch(deleteOrder()).then(() => {
        navigate('/');
      });
    }
  }, [dispatch, navigate]);

  return (
    <Tooltip title="Löschen">
      <DeleteButton onDelete={handleDelete} />
    </Tooltip>
  );
}
