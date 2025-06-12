import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { Badge, IconButton, Tooltip } from '@mui/material';

import { useState } from 'react';
import { useSelector } from 'react-redux';

import { useCurrentOrder } from '../../hooks/useCurrentOrder';
import { useSaveOrder } from '../../hooks/useSaveOrder';
import { AppState } from '../../store';

export function SaveOrderAction() {
  const order = useCurrentOrder();
  const [loading, setLoading] = useState(false);

  const unsavedChanges = useSelector<AppState, boolean>(({ app }) => app.unsavedChanges);
  const saveOrder = useSaveOrder();

  const color = unsavedChanges ? 'error' : 'default';

  const handleSave = () => {
    setLoading(true);
    saveOrder(order).then(() => {
      setLoading(false);
    });
  };

  return (
    <Tooltip title="Speichern">
      <IconButton loading={loading} onClick={handleSave} color="inherit">
        <Badge color={color} variant="dot">
          <SaveOutlinedIcon />
        </Badge>
      </IconButton>
    </Tooltip>
  );
}
