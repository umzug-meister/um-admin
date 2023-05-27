import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { Badge, Divider, IconButton, Stack, Tooltip } from '@mui/material';

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useCurrentOrder } from '../hooks/useCurrentOrder';
import { useNavigateToOrder } from '../hooks/useNavigateToOrder';
import { AppDispatch, AppState } from '../store';
import { createUpdateOrder, deleteOrder } from '../store/appReducer';
import PrintOrder from './PrintOrder';

export function OrderEditActions() {
  const unsavedChanges = useSelector<AppState, boolean>(({ app }) => app.unsavedChanges);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const navigateToOrder = useNavigateToOrder();
  const order = useCurrentOrder();

  const handleSave = useCallback(() => {
    dispatch(createUpdateOrder({ callback: navigateToOrder, id: order?.id }));
  }, [dispatch, order, navigateToOrder]);

  const handleCopy = useCallback(() => {
    dispatch(createUpdateOrder({ callback: navigateToOrder, id: undefined }));
  }, [dispatch, navigateToOrder]);

  const handleDelete = useCallback(() => {
    if (window.confirm('Auftrag wirklich löschen?')) {
      dispatch(deleteOrder());
      navigate('/');
    }
  }, [dispatch, navigate]);

  const color = unsavedChanges ? 'warning' : 'default';

  return (
    <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
      <Divider orientation="vertical" />
      <Stack direction="row" spacing={2}>
        <Tooltip title="Speichern">
          <IconButton onClick={handleSave}>
            <Badge color={color} variant="dot">
              <SaveOutlinedIcon />
            </Badge>
          </IconButton>
        </Tooltip>
        <Tooltip title="Kopieren" onClick={handleCopy}>
          <IconButton>
            <FileCopyOutlinedIcon />
          </IconButton>
        </Tooltip>
      </Stack>
      <Stack direction="row" spacing={2}>
        <PrintOrder />
        <Tooltip title="E-Mail Text">
          <IconButton
            onClick={() => {
              navigate('email-text');
            }}
          >
            <EmailOutlinedIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      <Tooltip title="Löschen">
        <IconButton onClick={handleDelete} color="error">
          <DeleteOutlinedIcon />
        </IconButton>
      </Tooltip>
      <Divider orientation="vertical" />
    </Stack>
  );
}
