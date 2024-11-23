import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import { Box, Button } from '@mui/material';

import { useDispatch } from 'react-redux';

import { AppDispatch } from '../store';
import { addNotification } from '../store/notificationReducer';

interface Props {
  elementID: string;
}
export function CopyOfferButton({ elementID }: Readonly<Props>) {
  const dispatch = useDispatch<AppDispatch>();

  const onCopy = () => {
    const text = document.getElementById(elementID);

    if (text) {
      let range: any;
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
      dispatch(addNotification({ message: 'In die Zwischenablage kopiert', severity: 'success' }));
    }
  };

  return (
    <Box>
      <Box width={200}>
        <Button startIcon={<ContentCopyOutlinedIcon />} variant="contained" onClick={onCopy}>
          Kopieren
        </Button>
      </Box>
    </Box>
  );
}
