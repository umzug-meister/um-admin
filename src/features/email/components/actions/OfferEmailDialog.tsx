import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { AppOptions } from '../../../../app-types';
import { useAppServices } from '../../../../hooks/useAppServices';
import { generateUrzPdf } from '../../../../pdf/OrderPdf';
import { orderFileName } from '../../../../pdf/filename';
import { AppState } from '../../../../store';
import { useOfferSubject } from '../../hooks/useOfferSubject';
import { sendMail } from '../../mail-proxy-client';
import { EmailEditor } from '../EmailEditor';

import { AppPacking, AppService, Order } from 'um-types';

interface Props {
  order: Order;
  rootOrder?: Order;
  onClose: () => void;
  open: boolean;
  emailTextId: string;
}

export function OfferEmailDialog({ onClose, open, order, rootOrder, emailTextId }: Readonly<Props>) {
  const [subject, setSubject] = useOfferSubject(rootOrder?.id ?? order.id);
  const [html, setHtml] = useState('<p></p>');

  const options = useSelector<AppState, AppOptions>((s) => s.app.options);
  const services = useAppServices<AppService>('Bohrarbeiten');
  const packings = useAppServices<AppPacking>('Packmaterial');

  useEffect(() => {
    const emailTemplate = document.getElementById(emailTextId)?.innerHTML;
    if (emailTemplate) setHtml(emailTemplate);
  }, [order]);

  const { customer } = order;
  const filename = orderFileName(order);
  const rootfilename = rootOrder && orderFileName(rootOrder);

  const attachmentNames = [filename];
  rootfilename && attachmentNames.push(rootfilename);

  const onSend = () => {
    const orderAsBase64 = generateUrzPdf({
      options,
      order,
      services: [...services, ...packings],
      base64: true,
    });

    const rootOrderAsBase64 =
      rootOrder &&
      generateUrzPdf({
        options,
        order: rootOrder,
        services: [...services, ...packings],
        base64: true,
      });
    if (order.date && orderAsBase64) {
      const attachments = [{ content: orderAsBase64, filename }];

      if (rootOrderAsBase64 && rootfilename) {
        attachments.push({ content: rootOrderAsBase64, filename: rootfilename });
      }
      return sendMail({
        type: 'offer' as const,
        to: (customer.email ?? customer.emailCopy) as string,
        subject,
        variables: {
          content: html,
        },
        attachments,
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
      attachmentNames={attachmentNames}
    />
  );
}
