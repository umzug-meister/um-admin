import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import SendTimeExtensionOutlinedIcon from '@mui/icons-material/SendTimeExtensionOutlined';
import { Box, Divider, IconButton, Menu, MenuList, Paper } from '@mui/material';

import { useEffect, useState } from 'react';

import { Urls } from '../../../../api/Urls';
import { appRequest } from '../../../../api/fetch-client';
import { useCurrentOrder } from '../../../../hooks/useCurrentOrder';
import { MenuItemWithIcon } from '../MenuItemWithIcon';
import { EMailOfferTemplate } from '../email-text-blocks/offer/EmailOfferTemplate';
import { EmailEditDialog } from './EmailOfferDialog';
import { EmailTextAction } from './EmailTextAction';
import { SendMultipleOfferAction } from './SendMultipleOfferAction';
import { SendRejectionAction } from './SendRejectionAction';

import { Order } from 'um-types';

const EMAIL_MENU_ID = 'email-menu';
const EMAIL_MENU_BUTTON_ID = 'email-menu-button';
const MULTIPLE_OFFER_EMAIL_TEXT_ID = 'multiple-offer-email-text-in-dialog';
const SINGLE_OFFER_EMAIL_TEXT_ID = 'offer-email-text-in-dialog';

export function EmailActions() {
  const [singleOfferDialog, setSingleOfferDialog] = useState(false);
  const [multipleOfferDialog, setMultipleOfferDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [rootOrder, setRootOrder] = useState<Order | null>(null);

  const order = useCurrentOrder();

  useEffect(() => {
    const copyOf = order?.isCopyOf;

    if (copyOf) {
      appRequest('get')(Urls.orderById(copyOf)).then((order) => {
        setRootOrder(order);
      });
    }
  }, [order?.isCopyOf]);

  if (!order || !rootOrder) return null;

  const allowOpiniated = typeof order.isCopyOf !== 'undefined';

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box id={MULTIPLE_OFFER_EMAIL_TEXT_ID} display="none">
        <EMailOfferTemplate order={order} rootOrder={rootOrder} />
      </Box>
      <Box id={SINGLE_OFFER_EMAIL_TEXT_ID} display="none">
        <EMailOfferTemplate order={order} />
      </Box>
      <EmailEditDialog
        open={singleOfferDialog}
        onClose={() => setSingleOfferDialog(false)}
        order={order}
        emailTextId={SINGLE_OFFER_EMAIL_TEXT_ID}
      />
      <EmailEditDialog
        open={multipleOfferDialog}
        onClose={() => setMultipleOfferDialog(false)}
        order={order}
        rootOrder={rootOrder}
        emailTextId={MULTIPLE_OFFER_EMAIL_TEXT_ID}
      />
      <IconButton
        id={EMAIL_MENU_BUTTON_ID}
        aria-controls={open ? EMAIL_MENU_ID : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        color="inherit"
      >
        <EmailOutlinedIcon />
      </IconButton>
      <Paper>
        <Menu
          id={EMAIL_MENU_ID}
          anchorEl={anchorEl}
          open={open}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': EMAIL_MENU_BUTTON_ID,
          }}
        >
          <MenuList>
            <MenuItemWithIcon
              text="Angebot versenden"
              onClick={() => {
                handleClose();
                setSingleOfferDialog(true);
              }}
            >
              <SendOutlinedIcon />
            </MenuItemWithIcon>
            <EmailTextAction handleClose={handleClose} />
            {allowOpiniated && (
              <MenuItemWithIcon
                text={`2 Angebote versenden (${order.id} + ${rootOrder.id})`}
                onClick={() => {
                  handleClose();
                  setMultipleOfferDialog(true);
                }}
              >
                <SendTimeExtensionOutlinedIcon />
              </MenuItemWithIcon>
            )}
            <Divider />
            <SendRejectionAction handleClose={handleClose} />
          </MenuList>
        </Menu>
      </Paper>
    </>
  );
}
