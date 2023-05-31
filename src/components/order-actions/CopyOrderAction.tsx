import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';
import { IconButton, Tooltip } from '@mui/material';

import { useCallback } from 'react';

import { useCurrentOrder } from '../../hooks/useCurrentOrder';
import { useSaveOrder } from '../../hooks/useSaveOrder';

import { Order } from 'um-types';

export default function CopyOrderAction() {
  const order = useCurrentOrder();
  const saveOrder = useSaveOrder();

  const handleCopy = useCallback(() => {
    const next = { ...order, id: undefined } as Order;
    saveOrder(next);
  }, [saveOrder, order]);

  return (
    <Tooltip title="Kopieren">
      <IconButton onClick={handleCopy}>
        <FileCopyOutlinedIcon />
      </IconButton>
    </Tooltip>
  );
}
