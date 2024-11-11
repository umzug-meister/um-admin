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

import { sendOffer } from '../../api/mail-proxy-client';
import { useCurrentOrder } from '../../hooks/useCurrentOrder';
import { getPrintableDate } from '../../utils/utils';
import { EMailTextTemplate } from '../email-text-blocks/EMailTemplates';
import { AppTextField } from '../shared/AppTextField';

const EMAIL_TEXT_ID = 'email-text-in-dialog';

export default function EditEmailAction() {
  const [open, setOpen] = React.useState(false);
  const order = useCurrentOrder();

  if (!order) return null;

  return (
    <>
      <Box id={EMAIL_TEXT_ID} display="none">
        <EMailTextTemplate order={order} />
      </Box>
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
  const [subject, setSubject] = useSubject();
  const [html, setHtml] = useState('<p></p>');

  useEffect(() => {
    const emailTemplate = document.getElementById(EMAIL_TEXT_ID)?.innerHTML;
    if (emailTemplate) setHtml(emailTemplate);
  }, [order]);

  if (!order) return null;

  const { open, onClose } = props;
  const { customer } = order;

  const onSend = () => {
    const email = {
      to: (customer.email ?? customer.emailCopy) as string,
      subject,
      templateName: 'email',
      variables: {
        date: getPrintableDate(order.date),
        content: html,
      },
    };

    sendOffer(email).then(() => {
      console.log('Email sent');
    });
  };

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle>E-Mail Erstellen</DialogTitle>
      <DialogContent>
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
        <Button variant="contained" color="primary" onClick={onSend}>
          Senden
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function useSubject() {
  const order = useCurrentOrder();
  const [subject, setSubject] = useState('');
  useEffect(() => {
    if (order) {
      setSubject(`📦 Umzugsangebot zu Ihrer Anfrage ${order.id} am ${order.date}`);
    }
  }, [order]);

  return [subject, setSubject as (value: string) => void] as const;
}
