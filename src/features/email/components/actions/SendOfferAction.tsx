import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { Box } from '@mui/material';

import { useState } from 'react';

import { useCurrentOrder } from '../../../../hooks/useCurrentOrder';
import { MenuItemWithIcon } from '../MenuItemWithIcon';
import { EMailOfferTemplate } from '../email-text-blocks/offer/EmailOfferTemplate';
import { EmailEditDialog } from './EmailOfferDialog';

const EMAIL_TEXT_ID = 'offer-email-text-in-dialog';

export function SendOfferAction({ handleClose }: EmailActionProps) {
  const [open, setOpen] = useState(false);
  const order = useCurrentOrder();

  if (!order) return null;

  return (
    <>
      <Box id={EMAIL_TEXT_ID} display="none">
        <EMailOfferTemplate order={order} />
      </Box>

      <MenuItemWithIcon text="Angebot versenden" onClick={() => setOpen(true)}>
        <SendOutlinedIcon />
      </MenuItemWithIcon>
      <EmailEditDialog open={open} onClose={handleClose} order={order} emailTextId={EMAIL_TEXT_ID} />
    </>
  );
}
