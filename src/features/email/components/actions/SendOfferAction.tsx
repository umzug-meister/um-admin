import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { Box } from '@mui/material';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { AppOptions } from '../../../../app-types';
import { useAppServices } from '../../../../hooks/useAppServices';
import { useCurrentOrder } from '../../../../hooks/useCurrentOrder';
import { generateUrzPdf } from '../../../../pdf/OrderPdf';
import { orderFileName } from '../../../../pdf/filename';
import { AppState } from '../../../../store';
import { useOfferSubject } from '../../hooks/useOfferSubject';
import { sendMail } from '../../mail-proxy-client';
import { EmailEditor } from '../EmailEditor';
import { MenuItemWithIcon } from '../MenuItemWithIcon';
import { EMailOfferTemplate } from '../email-text-blocks/offer/EmailOfferTemplate';

import { AppPacking, AppService } from 'um-types';

const EMAIL_TEXT_ID = 'offer-email-text-in-dialog';

export function SendOfferAction({ handleClose }: EmailActionProps) {
  const [open, setOpen] = useState(false);
  const order = useCurrentOrder();

  if (!order) return null;

  const onRequestClose = () => {
    handleClose();
  };

  return (
    <>
      <Box id={EMAIL_TEXT_ID} display="none">
        <EMailOfferTemplate order={order} />
      </Box>

      <MenuItemWithIcon text="Angebot versenden" onClick={() => setOpen(true)}>
        <SendOutlinedIcon />
      </MenuItemWithIcon>
      <EmailEditDialog open={open} onClose={onRequestClose} />
    </>
  );
}

function EmailEditDialog(props: Readonly<{ open: boolean; onClose: () => void }>) {
  const order = useCurrentOrder();
  const [subject, setSubject] = useOfferSubject();
  const [html, setHtml] = useState('<p></p>');
  const options = useSelector<AppState, AppOptions>((s) => s.app.options);
  const services = useAppServices<AppService>('Bohrarbeiten');
  const packings = useAppServices<AppPacking>('Packmaterial');

  useEffect(() => {
    const emailTemplate = document.getElementById(EMAIL_TEXT_ID)?.innerHTML;
    if (emailTemplate) setHtml(emailTemplate);
  }, [order]);

  if (!order) return null;

  const { open, onClose } = props;
  const { customer } = order;
  const filename = orderFileName(order);

  const onSend = () => {
    const orderAsBase64 = generateUrzPdf({
      options,
      order: order,
      services: [...services, ...packings],
      base64: true,
    });
    if (order.date && orderAsBase64) {
      sendMail({
        type: 'offer' as const,
        to: (customer.email ?? customer.emailCopy) as string,
        subject,
        variables: {
          content: html,
        },
        attachment: { content: orderAsBase64.split('base64,')[1], filename },
      })
        .then((res) => {
          console.log(res);
          onClose();
        })
        .catch((err) => {
          console.log(err);
          alert('Fehler beim Senden der E-Mail');
        });
    }
  };

  return (
    <EmailEditor
      open={open}
      onClose={onClose}
      onSend={onSend}
      html={html}
      setHtml={setHtml}
      setSubject={setSubject}
      subject={subject}
      to={customer.emailCopy ?? customer.email}
      attachmentName={filename}
    />
  );
}
