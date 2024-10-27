import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import FormatListNumberedOutlinedIcon from '@mui/icons-material/FormatListNumberedOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  useTheme,
} from '@mui/material';

import React from 'react';
import { NavLink } from 'react-router-dom';

import { VersionBadge } from './VersionBadge';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SideMenu({ onClose, open }: Readonly<Props>) {
  const theme = useTheme();

  return (
    <Drawer
      PaperProps={{
        sx: {
          background: theme.palette.background.default,
        },
      }}
      open={open}
      onClose={onClose}
    >
      <Box p={3} display="flex" flexDirection="column" alignItems="center" justifyContent="space-between" height="100%">
        <Box display="flex" flexDirection="column" alignItems="center" gap={4}>
          <VersionBadge />

          <List>
            <DrawerItem onClose={onClose} to="/edit/-1" primaryText="Auftrag">
              <AddOutlinedIcon />
            </DrawerItem>
            <DrawerItem onClose={onClose} primaryText="Alle Aufträge" to="/">
              <FormatListNumberedOutlinedIcon />
            </DrawerItem>

            <Box mt={1} mb={1}>
              <Divider />
            </Box>
            <DrawerItem onClose={onClose} to="/blanco" primaryText="Neue Rechnung">
              <ReceiptLongOutlinedIcon />
            </DrawerItem>
            <Box mt={1} mb={1}>
              <Divider />
            </Box>
            <DrawerItem onClose={onClose} to="/statistics" primaryText="Statistiken">
              <BarChartOutlinedIcon />
            </DrawerItem>
            <Box mt={1} mb={1}>
              <Divider />
            </Box>
            <DrawerItem onClose={onClose} to="/settings" primaryText="Einstellungen">
              <SettingsOutlinedIcon />
            </DrawerItem>
          </List>
        </Box>

        <Box id="bottom-sidebar">
          <Box display="flex" justifyContent="center">
            <Tooltip title="Abmelden">
              <Link href={`/wp-login.php?action=logout`}>
                <IconButton>
                  <LogoutOutlinedIcon />
                </IconButton>
              </Link>
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}

interface DrawerItemProps {
  to: string;
  primaryText: string;
  onClose: () => void;
}

function DrawerItem({ to, primaryText, onClose, children }: React.PropsWithChildren<DrawerItemProps>) {
  const theme = useTheme();

  return (
    <NavLink
      className={({ isActive }) => {
        return isActive ? 'active-menu-link' : '';
      }}
      style={({ isActive }) => {
        return {
          textDecoration: 'none',
          color: isActive ? theme.palette.primary.main : 'unset',
        };
      }}
      to={to}
    >
      <ListItem disablePadding>
        <ListItemButton onClick={onClose}>
          <ListItemIcon>{children}</ListItemIcon>
          <ListItemText primary={primaryText} />
        </ListItemButton>
      </ListItem>
    </NavLink>
  );
}
