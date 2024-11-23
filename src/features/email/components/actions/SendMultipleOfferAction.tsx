import SendTimeExtensionOutlinedIcon from '@mui/icons-material/SendTimeExtensionOutlined';
import { Box } from '@mui/material';

import { useEffect, useState } from 'react';

import { Urls } from '../../../../api/Urls';
import { appRequest } from '../../../../api/fetch-client';
import { useCurrentOrder } from '../../../../hooks/useCurrentOrder';
import { MenuItemWithIcon } from '../MenuItemWithIcon';
import { EMailOfferTemplate } from '../email-text-blocks/offer/EmailOfferTemplate';
import { EmailEditDialog } from './EmailOfferDialog';

import { Order } from 'um-types';

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
      <MenuItemWithIcon text={`2 Angebote versenden (${order.id} + ${rootOrder.id})`} onClick={() => setOpen(true)}>
        <SendTimeExtensionOutlinedIcon />
      </MenuItemWithIcon>
      <EmailEditDialog
        open={open}
        onClose={handleClose}
        order={order}
        rootOrder={rootOrder}
        emailTextId={EMAIL_TEXT_ID}
      />
    </>
  );
}
