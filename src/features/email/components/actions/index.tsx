import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { Divider, IconButton, Menu, MenuList, Paper } from '@mui/material';

import { useState } from 'react';

import { EmailTextAction } from './EmailTextAction';
import { SendOfferAction } from './SendOfferAction';
import { SendRejectionAction } from './SendRejectionAction';

export function EmailActions() {
  const EMAIL_MENU_ID = 'email-menu';
  const EMAIL_MENU_BUTTON_ID = 'email-menu-button';

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
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
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': EMAIL_MENU_BUTTON_ID,
          }}
        >
          <MenuList>
            <SendOfferAction handleClose={handleClose} />
            <EmailTextAction handleClose={handleClose} />
            <Divider />
            <SendRejectionAction handleClose={handleClose} />
          </MenuList>
        </Menu>
      </Paper>
    </>
  );
}
