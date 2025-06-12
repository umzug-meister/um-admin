import CancelScheduleSendOutlinedIcon from '@mui/icons-material/CancelScheduleSendOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import SendTimeExtensionOutlinedIcon from '@mui/icons-material/SendTimeExtensionOutlined';
import { Box, Divider, IconButton, Menu, MenuList } from '@mui/material';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Urls } from '../../../../api/Urls';
import { appRequest } from '../../../../api/fetch-client';
import { useCurrentOrder } from '../../../../hooks/useCurrentOrder';
import { AppDispatch } from '../../../../store';
import { updateOrderProps } from '../../../../store/appReducer';
import { MenuItemWithIcon } from '../MenuItemWithIcon';
import { EMailOfferTemplate } from '../email-text-blocks/offer/EmailOfferTemplate';
import { RejectionEmailTemplate } from '../email-text-blocks/rejection/RejectionEmailTemplate';
import { EmailTextAction } from './EmailTextAction';
import { OfferEmailDialog } from './OfferEmailDialog';
import { RejectionEmailDialog } from './RejectionEmailDialog';

import { Order } from '@umzug-meister/um-core';

const EMAIL_MENU_ID = 'email-menu';
const EMAIL_MENU_BUTTON_ID = 'email-menu-button';

const SEVERAL_OFFERS_EMAIL_TEXT_ID = 'multiple-offer-email-text-in-dialog';
const SINGLE_OFFER_EMAIL_TEXT_ID = 'offer-email-text-in-dialog';
const REJECTION_EMAIL_TEXT_ID = 'rejection-email-text-in-dialog';

const DOMAIN_BLACKLIST = ['@live.', '@outlook.', '@hotmail.', '@msn.'];

export function EmailActions({ disabled: disabledButton }: Readonly<OrderActionBaseProps>) {
  const [singleOfferDialogOpen, setSingleOfferDialogOpen] = useState(false);
  const [severalOfferDialogOpen, setSeveralOfferDialogOpen] = useState(false);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [rootOrder, setRootOrder] = useState<Order | null>(null);

  const order = useCurrentOrder();

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const copyOf = order?.isCopyOf;

    if (copyOf) {
      appRequest('GET')(Urls.orderById(copyOf)).then((order) => {
        setRootOrder(order);
      });
    }
  }, [order?.isCopyOf]);

  if (!order) return null;

  const email = order.customer?.email ?? order.customer?.emailCopy;

  const disabled = !email || email.length === 0 || DOMAIN_BLACKLIST.some((domain) => email.includes(domain));

  const allowOpiniated = typeof order.isCopyOf !== 'undefined';

  const menuOpen = Boolean(anchorEl);

  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const openRejectionDialog = () => {
    dispatch(updateOrderProps({ path: ['lupd'], value: Date.now() }));
    setRejectionDialogOpen(true);
    closeMenu();
  };

  return (
    <>
      <IconButton
        id={EMAIL_MENU_BUTTON_ID}
        aria-controls={menuOpen ? EMAIL_MENU_ID : undefined}
        aria-haspopup="true"
        aria-expanded={menuOpen ? 'true' : undefined}
        onClick={openMenu}
        color="inherit"
        disabled={disabledButton}
      >
        <EmailOutlinedIcon />
      </IconButton>

      <Menu
        id={EMAIL_MENU_ID}
        anchorEl={anchorEl}
        open={menuOpen}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        onClose={closeMenu}
        slotProps={{
          list: {
            'aria-labelledby': EMAIL_MENU_BUTTON_ID,
          },
        }}
      >
        <MenuList>
          <MenuItemWithIcon
            disabled={disabled}
            text="Angebot versenden"
            onClick={() => {
              closeMenu();
              setSingleOfferDialogOpen(true);
            }}
          >
            <SendOutlinedIcon />
          </MenuItemWithIcon>
          <EmailTextAction handleClose={closeMenu} />
          {allowOpiniated && rootOrder ? (
            <MenuItemWithIcon
              disabled={disabled}
              text={`2 Angebote versenden (${order.id} + ${rootOrder.id})`}
              onClick={() => {
                closeMenu();
                setSeveralOfferDialogOpen(true);
              }}
            >
              <SendTimeExtensionOutlinedIcon />
            </MenuItemWithIcon>
          ) : null}
          <Divider />
          <MenuItemWithIcon disabled={disabled} onClick={openRejectionDialog} text="Absage versenden">
            <CancelScheduleSendOutlinedIcon />
          </MenuItemWithIcon>
        </MenuList>
      </Menu>

      <Box display={'none'}>
        <Box id={SINGLE_OFFER_EMAIL_TEXT_ID}>
          <EMailOfferTemplate order={order} />
        </Box>

        {rootOrder && (
          <Box id={SEVERAL_OFFERS_EMAIL_TEXT_ID}>
            <EMailOfferTemplate order={order} rootOrder={rootOrder} />
          </Box>
        )}

        <Box id={REJECTION_EMAIL_TEXT_ID}>
          <RejectionEmailTemplate />
        </Box>
      </Box>

      <OfferEmailDialog
        open={singleOfferDialogOpen}
        onClose={() => setSingleOfferDialogOpen(false)}
        order={order}
        emailTextId={SINGLE_OFFER_EMAIL_TEXT_ID}
      />

      {rootOrder && (
        <OfferEmailDialog
          open={severalOfferDialogOpen}
          onClose={() => setSeveralOfferDialogOpen(false)}
          order={order}
          rootOrder={rootOrder}
          emailTextId={SEVERAL_OFFERS_EMAIL_TEXT_ID}
        />
      )}
      <RejectionEmailDialog
        emailTextId={REJECTION_EMAIL_TEXT_ID}
        open={rejectionDialogOpen}
        onClose={() => setRejectionDialogOpen(false)}
      />
    </>
  );
}
