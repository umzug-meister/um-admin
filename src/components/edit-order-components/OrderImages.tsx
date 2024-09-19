import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import NavigateBeforeOutlinedIcon from '@mui/icons-material/NavigateBeforeOutlined';
import NavigateNextOutlinedIcon from '@mui/icons-material/NavigateNextOutlined';
import { Box, Button, ButtonGroup } from '@mui/material';

import { useState } from 'react';

import { useCurrentOrder } from '../../hooks/useCurrentOrder';
import { AppDialog } from '../shared/AppDialog';

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

export default function OrderImages() {
  const [open, setOpen] = useState(false);

  const curOrder = useCurrentOrder();

  const [page, setPage] = useState(0);
  const length = curOrder?.bucketImages?.length ?? 0;

  if (length === 0) {
    return null
  }

  const handleChange = (offset: number) => {
    return function () {
      setPage((p) => {
        const next = mod(p + offset, length);
        return next;
      });
    };
  };

  return (
    <>
      <AppDialog
        title="Anhänge"
        open={open}
        onRequestClose={() => {
          setOpen(false);
        }}
      >
        <Box p={1} position="relative" width={'100%'}>
          <Box>
            <img
              alt=""
              style={{
                display: 'block',
                margin: 'auto',
                maxHeight: 'calc(100vh - 145px)',
                maxWidth: '100%',
                objectPosition: 'center',
              }}
              src={curOrder?.bucketImages?.[page].Location}
            />
          </Box>
          <Box position="absolute" bottom={16} right={'50%'} sx={{ transform: 'translateX(50%)' }}>
            <ButtonGroup variant="contained">
              <Button onClick={handleChange(-1)}>
                <NavigateBeforeOutlinedIcon />
              </Button>
              <Button
                onClick={() => {
                  setPage(0);
                }}
              >{`${page + 1}/${length}`}</Button>
              <Button onClick={handleChange(1)}>
                <NavigateNextOutlinedIcon />
              </Button>
            </ButtonGroup>
          </Box>
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
