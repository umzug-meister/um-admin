import CancelScheduleSendOutlinedIcon from '@mui/icons-material/CancelScheduleSendOutlined';
import { Box } from '@mui/material';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { useCurrentOrder } from '../../../../hooks/useCurrentOrder';
import { useSaveOrder } from '../../../../hooks/useSaveOrder';
import { AppDispatch } from '../../../../store';
import { updateOrderProps } from '../../../../store/appReducer';
import { addNotification } from '../../../../store/notificationReducer';
import { useRejectionSubject } from '../../hooks/useRejectionSubject';
import { sendMail } from '../../mail-proxy-client';
import { EmailEditor } from '../EmailEditor';
import { MenuItemWithIcon } from '../MenuItemWithIcon';
import { RejectionEmailTemplate } from '../email-text-blocks/rejection/RejectionEmailTemplate';

const EMAIL_TEXT_ID = 'rejection-email-text-in-dialog';

export function SendRejectionAction({ handleClose }: EmailActionProps) {
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const onRequestClose = () => {
    handleClose();
    setOpen(false);
  };

  const onOpen = () => {
    dispatch(updateOrderProps({ path: ['lupd'], value: Date.now() }));
    setOpen(true);
  };

  return (
    <>
      <Box id={EMAIL_TEXT_ID} display="none">
        <RejectionEmailTemplate />
      </Box>
      <MenuItemWithIcon onClick={onOpen} text="Absage versenden">
        <CancelScheduleSendOutlinedIcon />
      </MenuItemWithIcon>
      <EmailDialog open={open} onClose={onRequestClose} />
    </>
  );
}

function EmailDialog(props: Readonly<{ open: boolean; onClose: () => void }>) {
  const order = useCurrentOrder();

  const saveOrder = useSaveOrder();

  const dispatch = useDispatch<AppDispatch>();

  const [subject, setSubject] = useRejectionSubject();
  const [html, setHtml] = useState('<p></p>');

  useEffect(() => {
    const emailTemplate = document.getElementById(EMAIL_TEXT_ID)?.innerHTML;
    if (emailTemplate) setHtml(emailTemplate);
  }, [order]);

  if (!order) return null;

  const { open, onClose } = props;
  const { customer } = order;

  const onSend = () => {
    saveOrder(order).then(() => {
      sendMail({
        type: 'rejection' as const,
        subject,
        to: (customer.email ?? customer.emailCopy) as string,
        variables: {
          content: html,
        },
      })
        .then(() => {
          dispatch(addNotification({ severity: 'success', message: 'E-Mail wurde erfolgreich versendet' }));
          onClose();
        })
        .catch((err) => {
          console.error(err);
          dispatch(addNotification({ severity: 'error', message: 'E-Mail konnte nicht versendet werden' }));
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
