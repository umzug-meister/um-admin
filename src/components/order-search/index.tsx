import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Button, DialogActions, DialogTitle } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import { useState } from 'react';
import { OrderSearchDialogContent } from './OrderSearchDialogContent';
import { KeyboardIcon } from '../KeyboardIcon';

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
      <Dialog fullWidth={true} maxWidth={'lg'} open={open} onClose={handleClose}>
        <DialogTitle>Auftrag Suchen</DialogTitle>
        <OrderSearchDialogContent />
        <DialogActions>
          <Button onClick={handleClose} endIcon={<KeyboardIcon label="esc" />}>
            Abbrechen
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
      >
        {`Auftrag Suchen...`}
      </Button>
    </>
  );
}
