import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import { Alert, Box, Button, Snackbar, Typography } from '@mui/material';

import { useState } from 'react';

import Pulsating from './shared/Pulsating';

interface Props {
  elementID: string;
}
export function CopyOfferButton({ elementID }: Readonly<Props>) {
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const onCopy = () => {
    const text = document.getElementById(elementID);

    if (text) {
      let range;
      let selection;

      if (document.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElement(text);
        range.select();
      } else if (window.getSelection) {
        selection = window.getSelection();
        range = document.createRange();
        range.selectNodeContents(text);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }

      document.execCommand('copy');
      setOpenSnackbar(true);
    }
  };

  return (
    <Box>
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
      >
        <Alert severity="success">
          <Typography variant="body2">In die Zwischenablage kopiert</Typography>
        </Alert>
      </Snackbar>
      <Box width={200}>
        <Pulsating>
          <Button startIcon={<ContentCopyOutlinedIcon />} variant="contained" onClick={onCopy}>
            Text Kopieren
          </Button>
        </Pulsating>
      </Box>
    </Box>
  );
}
