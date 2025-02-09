import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Button, DialogActions, useTheme } from '@mui/material';
import Dialog from '@mui/material/Dialog';

import { useEffect, useState } from 'react';

import { KeyboardIcon } from '../KeyboardIcon';
import { OrderSearchDialogContent } from './OrderSearchDialogContent';

export default function OrderSearch() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const listener = (ev: KeyboardEvent) => {
      if (ev.key === 'k' && ev.ctrlKey) {
        setOpen(true);
      }
    };
    document.addEventListener('keypress', listener);

    return () => {
      document.removeEventListener('keypress', listener);
    };
  });

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
          color: theme.palette.text.disabled,
          backgroundColor: theme.palette.background.default,
          borderColor: theme.palette.divider,
        }}
        startIcon={<SearchOutlinedIcon />}
        variant="outlined"
        size="small"
        endIcon={<KeyboardIcon label={`${navigator.language === 'de-DE' ? 'Strg' : 'Ctrl'} + K`} />}
      >
        Auftrag Suchen...
      </Button>
    </>
  );
}
