import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';

import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

import { useCurrentOrder } from '../../hooks/useCurrentOrder';
import EMailText from '../../routes/EMailText';
import { EMailTextTemplate } from '../email-text-blocks/EMailTemplates';
import { AppTextField } from '../shared/AppTextField';

export default function EditEmailAction() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Tooltip title="E-Mail erstellen">
        <IconButton onClick={() => setOpen(true)} color="inherit">
          <EmailOutlinedIcon />
        </IconButton>
      </Tooltip>
      <EmailEditDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function EmailEditDialog(props: Readonly<{ open: boolean; onClose: () => void }>) {
  const order = useCurrentOrder();
  const [subject, setSubject] = useState('');
  const [html, setHtml] = useState('<strong>Test</strong>');
  console.log(html);

  useEffect(() => {
    const html = document.getElementById('email-text')?.innerHTML;
    console.log(html);
    setHtml(html);
  }, []);

  if (!order) return null;

  const { open, onClose } = props;
  const { customer } = order;
  return (
    <Dialog fullWidth maxWidth="lg" open={open} onClose={onClose}>
      <DialogTitle color="primary">
        <Typography sx={{ display: 'flex' }}>
          <CreateOutlinedIcon sx={{ marginRight: 2 }} />
          E-Mail erstellen
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box id="email-text" display={'none'}>
          <EMailTextTemplate order={order} />
        </Box>
        <Box display={'flex'} flexDirection="column" gap={1}>
          <AppTextField
            disabled
            value={customer.email ?? customer.emailCopy}
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
          <Box sx={{ height: 700 }}>
            <ReactQuill theme="snow" value={html} onChange={setHtml} />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button variant="contained" color="primary" onClick={onClose}>
          Senden
        </Button>
      </DialogActions>
    </Dialog>
  );
}
