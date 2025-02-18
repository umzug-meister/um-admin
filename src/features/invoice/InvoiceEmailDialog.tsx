import { useEffect, useState } from 'react';

import { useCurrentOrder } from '../../hooks/useCurrentOrder';
import { generateRechnung } from '../../pdf/InvoicePdf';
import { invoiceFileName } from '../../pdf/filename';
import { anrede } from '../../utils/utils';
import { EmailEditor } from '../email/components/EmailEditor';
import { sendMail } from '../email/mail-proxy-client';

import { Customer, Rechnung } from 'um-types';

interface Props {
  open: boolean;
  onClose: () => void;
}

function initInvoiceSubject(rNumber: string | undefined) {
  return `Rechnung zu Ihrem Umzug ${rNumber}`;
}

function initInvoiceHtml(customer: Customer | undefined) {
  const lines = [
    '',
    '',
    `vielen Dank, dass Sie unsere Leistungen in Anspruch genommen haben.`,
    `Im Anhang befindet sich Ihre Rechnung.`,
    ``,
  ];
  if (customer) {
    lines[0] = anrede(customer);
  }
  return `<p>${lines.join('<br/>')}</p>`;
}

export function InvoiceEmailDialog({ open, onClose }: Readonly<Props>) {
  const order = useCurrentOrder();

  const invoice = order?.rechnung;

  const [subject, setSubject] = useState(initInvoiceSubject(order?.rechnung?.rNumber));

  useEffect(() => {
    setSubject(initInvoiceSubject(invoice?.rNumber));
  }, [invoice?.rNumber]);

  const to = order?.customer.email || order?.customer.emailCopy;

  const customer = order?.customer;

  const [html, setHtml] = useState(initInvoiceHtml(customer));

  if (!invoice) {
    return null;
  }

  const filename = invoiceFileName(invoice);
  const onSend = () => {
    if (!to) {
      return Promise.resolve('');
    }

    const invoiceAsBase64 = generateRechnung({ rechnung: invoice, base64: true }) as string;

    return sendMail({
      to,
      subject,
      type: 'invoice',
      attachments: [
        {
          content: invoiceAsBase64,
          filename,
        },
      ],
      variables: {
        content: html,
      },
    });
  };

  return (
    <EmailEditor
      to={to}
      onSend={onSend}
      html={html}
      setHtml={setHtml}
      subject={subject}
      setSubject={setSubject}
      open={open}
      attachmentNames={[filename]}
      onClose={onClose}
    />
  );
}
