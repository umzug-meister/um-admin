import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { Button, ButtonProps } from '@mui/material';

export function PdfSaveButton(props: ButtonProps) {
  return (
    <Button startIcon={<FileDownloadOutlinedIcon />} variant="text" {...props}>
      Als PDF speichern
    </Button>
  );
}
