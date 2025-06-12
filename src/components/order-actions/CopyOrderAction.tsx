import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';
import { Alert, IconButton, Snackbar, Tooltip, Typography } from '@mui/material';

import { useCallback, useState } from 'react';

import { useCurrentOrder } from '../../hooks/useCurrentOrder';
import { useSaveOrder } from '../../hooks/useSaveOrder';

import { Order } from '@umzug-meister/um-core';

export default function CopyOrderAction({ disabled }: Readonly<OrderActionBaseProps>) {
  const order = useCurrentOrder();
  const saveOrder = useSaveOrder();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCopy = useCallback(() => {
    //@ts-ignore
    const next = {
      ...order,
      isCopyOf: order?.isCopyOf ?? order?.id,
      customer: {
        ...(order?.customer ?? {}),

        email: undefined,
        emailCopy: order?.customer?.emailCopy ?? order?.customer?.email,
      },
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
        <IconButton disabled={disabled} onClick={handleCopy} color="inherit">
          <FileCopyOutlinedIcon />
        </IconButton>
      </Tooltip>
    </>
  );
}
