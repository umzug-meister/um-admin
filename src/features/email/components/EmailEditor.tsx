import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

import ReactQuill from 'react-quill-new';
import { useDispatch } from 'react-redux';

import { AppTextField } from '../../../components/shared/AppTextField';
import { AppDispatch } from '../../../store';
import { addNotification } from '../../../store/notificationReducer';

interface Props {
  open: boolean;
  onClose(): void;
  subject: string;
  setSubject(subject: string): void;
  html: string;
  setHtml(html: string): void;
  onSend(): Promise<any>;
  to: string | undefined;
  attachmentName?: string;
}

export function EmailEditor({
  open,
  onClose,
  html,
  onSend,
  setHtml,
  setSubject,
  subject,
  to,
  attachmentName,
}: Readonly<Props>) {
  const dispatch = useDispatch<AppDispatch>();

  const onSendEmail = () => {
    onSend()
      .then(() => {
        onClose();
        dispatch(addNotification({ severity: 'success', message: 'E-Mail wurde erfolgreich versendet' }));
      })
      .catch((err) => {
        console.error(err);
        dispatch(addNotification({ severity: 'error', message: 'E-Mail konnte nicht versendet werden' }));
      });
  };
  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle>E-Mail erstellen</DialogTitle>
      <DialogContent>
        <Box display={'flex'} flexDirection="column" gap={1}>
          <AppTextField
            disabled
            value={to}
            slotProps={{
              input: {
                startAdornment: <Typography sx={{ marginRight: 2 }}>Empfänger:</Typography>,
              },
            }}
          />
          <AppTextField
            onChange={(event) => setSubject(event.target.value)}
            value={subject}
            slotProps={{ input: { startAdornment: <Typography sx={{ marginRight: 2 }}>Betreff:</Typography> } }}
          />
          <Box sx={{ height: 650 }}>
            <ReactQuill theme="snow" value={html} onChange={setHtml} />
          </Box>
        </Box>
        <Attachment name={attachmentName} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button variant="contained" color="primary" onClick={onSendEmail} disabled={!to}>
          Senden
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function Attachment({ name }: { name: string | undefined }) {
  if (!name) return null;
  return (
    <Box display={'flex'}>
      <Box display={'flex'}>
        <AttachFileOutlinedIcon fontSize="small" />
      </Box>
      <Typography variant="body2">{name}</Typography>
    </Box>
  );
}
