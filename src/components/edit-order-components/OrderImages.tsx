import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import { Box, Button } from '@mui/material';

import { useState } from 'react';

import { useCurrentOrder } from '../../hooks/useCurrentOrder';
import { AppDialog } from '../shared/AppDialog';

export default function OrderImages() {
  const [open, setOpen] = useState(false);

  const curOrder = useCurrentOrder();

  if (!curOrder || !curOrder.images || curOrder.images.length === 0) {
    return null;
  }

  return (
    <>
      <AppDialog
        title="Anhänge"
        open={open}
        onRequestClose={() => {
          setOpen(false);
        }}
      >
        {curOrder?.images?.map((src) => {
          return (
            <Box m={1} key={src}>
              <img
                alt=""
                style={{
                  display: 'block',
                  margin: 'auto',
                  maxHeight: '70vh',
                  maxWidth: '90%',
                  objectPosition: 'center',
                }}
                src={src}
              />
            </Box>
          );
        })}
      </AppDialog>
      <Box m={'auto'}>
        <Button endIcon={<AttachFileOutlinedIcon />} onClick={() => setOpen(true)}>
          Anhänge
        </Button>
      </Box>
    </>
  );
}
