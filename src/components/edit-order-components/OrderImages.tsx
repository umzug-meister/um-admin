import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import { Box, Button, Pagination } from '@mui/material';

import React, { useState } from 'react';

import { useCurrentOrder } from '../../hooks/useCurrentOrder';
import { AppDialog } from '../shared/AppDialog';

export default function OrderImages() {
  const [open, setOpen] = useState(false);

  const curOrder = useCurrentOrder();

  const [page, setPage] = useState(1);
  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  if (!curOrder || !curOrder.images || curOrder.images.length == 0) {
    return null;
  }

  return (
    <>
      <AppDialog
        title="Bilder"
        open={open}
        onRequestClose={() => {
          setOpen(false);
        }}
      >
        <Box p={3} display="flex" flexDirection={'column'} alignItems="center" gap={2}>
          <img style={{ maxHeight: '600px' }} src={curOrder.images[page - 1]} />
          <Pagination page={page} onChange={handleChange} count={curOrder.images.length} />
        </Box>
      </AppDialog>
      <Box m={'auto'}>
        <Button endIcon={<AttachFileOutlinedIcon />} onClick={() => setOpen(true)}>
          Anhänge
        </Button>
      </Box>
    </>
  );
}
