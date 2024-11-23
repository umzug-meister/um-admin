import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

import ReactQuill from 'react-quill-new';
import { useDispatch } from 'react-redux';

import { AppTextField } from '../../../components/shared/AppTextField';
import { AppDispatch } from '../../../store';
import { addNotification } from '../../../store/notificationReducer';

interface Props {
  open: boolean;
  subject: string;
  html: string;
  to: string | undefined;
  attachmentNames?: string[];
  onSend(): Promise<any>;
  setSubject(subject: string): void;
  onClose(): void;
  setHtml(html: string): void;
}

export function EmailEditor({
  open,
  html,
  subject,
  to,
  attachmentNames,
  setSubject,
  setHtml,
  onClose,
  onSend,
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
            fullWidth
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
        {attachmentNames?.length && (
          <Box display={'flex'} gap={1}>
            {attachmentNames.map((name) => (
              <Chip size="small" key={name} label={name} icon={<AttachFileOutlinedIcon />}></Chip>
            ))}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button
          startIcon={<SendOutlinedIcon />}
          variant="contained"
          color="primary"
          onClick={onSendEmail}
          disabled={!to}
        >
          E-Mail versenden
        </Button>
      </DialogActions>
    </Dialog>
  );
}
