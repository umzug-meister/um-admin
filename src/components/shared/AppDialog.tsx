import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { Dialog, DialogTitle, IconButton } from '@mui/material';

import { PropsWithChildren } from 'react';

interface Props {
  title: string;
  open: boolean;
  onRequestClose: () => void;
}

export function AppDialog({ open, title, onRequestClose, children }: PropsWithChildren<Props>) {
  return (
    <Dialog
      sx={{
        '& .MuiPaper-root': {
          maxWidth: '1200px',
        },
      }}
      open={open}
      onClose={onRequestClose}
    >
      <DialogTitle>
        {title}
        <IconButton
          onClick={onRequestClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseOutlinedIcon />
        </IconButton>
      </DialogTitle>
      {children}
    </Dialog>
  );
}
