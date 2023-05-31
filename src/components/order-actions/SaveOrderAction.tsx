import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { Badge, IconButton, Tooltip } from '@mui/material';

import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { useCurrentOrder } from '../../hooks/useCurrentOrder';
import { useSaveOrder } from '../../hooks/useSaveOrder';
import { AppState } from '../../store';

export function SaveOrderAction() {
  const order = useCurrentOrder();

  const unsavedChanges = useSelector<AppState, boolean>(({ app }) => app.unsavedChanges);
  const saveOrder = useSaveOrder();

  const color = unsavedChanges ? 'error' : 'default';

  const handleSave = useCallback(() => {
    saveOrder(order);
  }, [order, saveOrder]);

  return (
    <Tooltip title="Speichern">
      <IconButton onClick={handleSave}>
        <Badge color={color} variant="dot">
          <SaveOutlinedIcon />
        </Badge>
      </IconButton>
    </Tooltip>
  );
}
