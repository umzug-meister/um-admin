import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Button, DialogActions } from '@mui/material';
import Dialog from '@mui/material/Dialog';

import { useState } from 'react';

import { KeyboardIcon } from '../KeyboardIcon';
import { OrderSearchDialogContent } from './OrderSearchDialogContent';

export default function OrderSearch() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog fullWidth={true} maxWidth={'md'} open={open} onClose={handleClose}>
        <OrderSearchDialogContent onClose={handleClose} />
        <DialogActions>
          <Button onClick={handleClose} endIcon={<KeyboardIcon label="esc" />}>
            Schließen
          </Button>
        </DialogActions>
      </Dialog>
      <Button
        onClick={handleClickOpen}
        sx={{
          borderRadius: 3,
          color: 'text.secondary',
          backgroundColor: 'grey.50',
          borderColor: 'grey.200',
        }}
        startIcon={<SearchOutlinedIcon />}
        variant="outlined"
        size="small"
      >
        {`Auftrag Suchen...`}
      </Button>
    </>
  );
}
