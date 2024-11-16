import CancelScheduleSendOutlinedIcon from '@mui/icons-material/CancelScheduleSendOutlined';

import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { useCurrentOrder } from '../../../../hooks/useCurrentOrder';
import { AppDispatch } from '../../../../store';
import { updateOrderProps } from '../../../../store/appReducer';
import { useRejectionSubject } from '../../hooks/useRejectionSubject';
import { EmailEditor } from '../EmailEditor';
import { MenuItemWithIcon } from '../MenuItemWithIcon';

export function SendRejectionAction({ handleClose }: EmailActionProps) {
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const onRequestClose = () => {
    handleClose();
  };

  const onOpen = () => {
    dispatch(updateOrderProps({ path: ['lupd'], value: Date.now() }));
    setOpen(true);
  };

  return (
    <>
      <MenuItemWithIcon onClick={onOpen} text="Absage versenden">
        <CancelScheduleSendOutlinedIcon />
      </MenuItemWithIcon>
      <EmailDialog open={open} onClose={onRequestClose} />
    </>
  );
}

function EmailDialog(props: Readonly<{ open: boolean; onClose: () => void }>) {
  const order = useCurrentOrder();

  const [subject, setSubject] = useRejectionSubject();
  const [html, setHtml] = useState('<p></p>');

  if (!order) return null;

  const { open, onClose } = props;
  const { customer } = order;

  const onSend = () => {};

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
