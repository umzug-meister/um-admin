import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { IconButton, Tooltip } from '@mui/material';

import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { AppDispatch } from '../../store';
import { deleteOrder } from '../../store/appReducer';

export function DeleteOrderAction() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleDelete = useCallback(() => {
    if (window.confirm('Auftrag wirklich löschen?')) {
      dispatch(deleteOrder());
      navigate('/');
    }
  }, [dispatch, navigate]);

  return (
    <Tooltip title="Löschen">
      <IconButton onClick={handleDelete} color="error">
        <DeleteOutlinedIcon />
      </IconButton>
    </Tooltip>
  );
}
