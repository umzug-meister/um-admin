import SendTimeExtensionOutlinedIcon from '@mui/icons-material/SendTimeExtensionOutlined';
import { Box } from '@mui/material';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Urls } from '../../../../api/Urls';
import { appRequest } from '../../../../api/fetch-client';
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

import { AppPacking, AppService, Order } from 'um-types';

const EMAIL_TEXT_ID = 'multiple-offer-email-text-in-dialog';

export function SendMultipleOfferAction({ handleClose }: EmailActionProps) {
  const order = useCurrentOrder();

  const [open, setOpen] = useState(false);

  const [rootOrder, setRootOrder] = useState<Order | null>(null);

  useEffect(() => {
    const copyOf = order?.isCopyOf;

    if (copyOf) {
      appRequest('get')(Urls.orderById(copyOf)).then((order) => {
        setRootOrder(order);
      });
    }
  }, [order?.isCopyOf]);

  if (!order || !rootOrder) return null;

  return (
    <>
      <Box id={EMAIL_TEXT_ID} display="none">
        <EMailOfferTemplate order={order} rootOrder={rootOrder} />
      </Box>
      <MenuItemWithIcon text={` 2 Angebote versenden (${order.id} & ${rootOrder.id})`} onClick={() => setOpen(true)}>
        <SendTimeExtensionOutlinedIcon />
      </MenuItemWithIcon>
      <EmailEditDialog open={open} onClose={handleClose} order={order} rootOrder={rootOrder} />
    </>
  );
}

interface Props {
  order: Order;
  rootOrder: Order;
  onClose: () => void;
  open: boolean;
}
function EmailEditDialog({ onClose, open, order, rootOrder }: Readonly<Props>) {
  const [subject, setSubject] = useOfferSubject(rootOrder.id);
  const [html, setHtml] = useState('<p></p>');

  const options = useSelector<AppState, AppOptions>((s) => s.app.options);
  const services = useAppServices<AppService>('Bohrarbeiten');
  const packings = useAppServices<AppPacking>('Packmaterial');

  useEffect(() => {
    const emailTemplate = document.getElementById(EMAIL_TEXT_ID)?.innerHTML;
    if (emailTemplate) setHtml(emailTemplate);
  }, [order]);

  const { customer } = order;
  const filename = orderFileName(order);
  const rootfilename = orderFileName(rootOrder);

  const onSend = () => {
    const orderAsBase64 = generateUrzPdf({
      options,
      order,
      services: [...services, ...packings],
      base64: true,
    });

    const rootOrderAsBase64 = generateUrzPdf({
      options,
      order: rootOrder,
      services: [...services, ...packings],
      base64: true,
    });
    if (order.date && orderAsBase64 && rootOrderAsBase64) {
      return sendMail({
        type: 'offer' as const,
        to: (customer.email ?? customer.emailCopy) as string,
        subject,
        variables: {
          content: html,
        },
        attachments: [
          { content: orderAsBase64, filename },
          { content: rootOrderAsBase64, filename: rootfilename },
        ],
      });
    }
    return Promise.reject(new Error('Etwas is schief gelaufen'));
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
      attachmentNames={[filename, rootfilename]}
    />
  );
}
