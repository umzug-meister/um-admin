import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';
import { Alert, IconButton, Snackbar, Tooltip, Typography } from '@mui/material';

import { useCallback, useState } from 'react';

import { useCurrentOrder } from '../../hooks/useCurrentOrder';
import { useSaveOrder } from '../../hooks/useSaveOrder';

import { Order } from 'um-types';

export default function CopyOrderAction() {
  const order = useCurrentOrder();
  const saveOrder = useSaveOrder();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCopy = useCallback(() => {
    //@ts-ignore
    const next = {
      ...order,
      isCopyOf: order?.id,
      id: undefined,
      lupd: undefined,
    } as Order;
    saveOrder(next);
    setOpenSnackbar(true);
  }, [saveOrder, order]);

  return (
    <>
      <Snackbar
        open={openSnackbar}
        onClose={() => {
          setOpenSnackbar(false);
        }}
        autoHideDuration={6000}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{ top: { xs: 60 } }}
      >
        <Alert severity="success">
          <Typography variant="body2">Auftrag erfolgreich kopiert</Typography>
        </Alert>
      </Snackbar>
      <Tooltip title="Kopieren">
        <IconButton onClick={handleCopy}>
          <FileCopyOutlinedIcon />
        </IconButton>
      </Tooltip>
    </>
  );
}
