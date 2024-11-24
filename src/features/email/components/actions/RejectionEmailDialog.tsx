import { useEffect, useState } from 'react';

import { useCurrentOrder } from '../../../../hooks/useCurrentOrder';
import { useSaveOrder } from '../../../../hooks/useSaveOrder';
import { useRejectionSubject } from '../../hooks/useRejectionSubject';
import { sendMail } from '../../mail-proxy-client';
import { EmailEditor } from '../EmailEditor';

export function RejectionEmailDialog(props: Readonly<{ open: boolean; onClose: () => void; emailTextId: string }>) {
  const order = useCurrentOrder();

  const saveOrder = useSaveOrder();

  const [subject, setSubject] = useRejectionSubject();
  const [html, setHtml] = useState('<p></p>');
  const { open, onClose, emailTextId } = props;

  useEffect(() => {
    const emailTemplate = document.getElementById(emailTextId)?.innerHTML;
    if (emailTemplate) setHtml(emailTemplate);
  }, [order]);

  if (!order) return null;

  const { customer } = order;

  const onSend = () => {
    return saveOrder(order).then(() => {
      sendMail({
        type: 'rejection',
        subject,
        to: (customer.email ?? customer.emailCopy) as string,
        variables: {
          content: html,
        },
        attachments: [],
      });
    });
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
    />
  );
}
