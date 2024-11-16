import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';

import { useCallback } from 'react';

import { useCurrentOrder } from '../../../../hooks/useCurrentOrder';
import { useSaveOrder } from '../../../../hooks/useSaveOrder';
import { MenuItemWithIcon } from '../MenuItemWithIcon';

export function EmailTextAction({ handleClose }: EmailActionProps) {
  const currentOrder = useCurrentOrder();
  const saveOrder = useSaveOrder();

  const onEmailRequest = useCallback(() => {
    handleClose();
    saveOrder(currentOrder).then((order) => {
      if (order !== null) {
        const id = order.id;

        const { origin, pathname } = window.location;
        window.open(`${origin}${pathname}#/email-text/${id}`, '_blank');
      }
    });
  }, [currentOrder, saveOrder, handleClose]);

  return (
    <MenuItemWithIcon onClick={onEmailRequest} text="Angebotstext anzeigen">
      <MessageOutlinedIcon />
    </MenuItemWithIcon>
  );
}
