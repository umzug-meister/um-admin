import FormatListNumberedOutlinedIcon from '@mui/icons-material/FormatListNumberedOutlined';
import ImportExportOutlinedIcon from '@mui/icons-material/ImportExportOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';

import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { Version } from './Version';

// import logo from './logo.png';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SideMenu({ onClose, open }: Props) {
  const theme = useTheme();

  return (
    <Drawer open={open} onClose={onClose}>
      <Box
        sx={{
          background: theme.palette.background.default,
        }}
        p={3}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        height="100%"
      >
        <Box id="top-sidebar">
          <List>
            <DrawerItem onClose={onClose} to="/edit/-1" primaryText="Neuer Auftrag">
              <ModeEditOutlineOutlinedIcon />
            </DrawerItem>
            <DrawerItem onClose={onClose} primaryText="Alle Aufträge" to="/">
              <FormatListNumberedOutlinedIcon />
            </DrawerItem>

            <DrawerItem onClose={onClose} to="/import" primaryText="Aufträge importieren">
              <ImportExportOutlinedIcon />
            </DrawerItem>
            <Box mt={1} mb={1}>
              <Divider />
            </Box>
            <DrawerItem onClose={onClose} to="/settings" primaryText="Einstellungen">
              <SettingsOutlinedIcon />
            </DrawerItem>
            <Box mt={1} mb={1}>
              <Divider />
            </Box>
            <DrawerItem onClose={onClose} to="/blanco" primaryText="Neue Rechnung">
              <ReceiptLongOutlinedIcon />
            </DrawerItem>
          </List>
        </Box>
        <Box id="bottom-sidebar">
          <Box p={2} display="flex" justifyContent="center" m={10}>
            {/* <Avatar variant="rounded" sx={{ width: 150, height: 158 }} alt="logo" src={logo} /> */}
          </Box>
          <Box display="flex" justifyContent="center">
            <Version />
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
  const navigate = useNavigate();

  const onClick = useCallback(() => {
    navigate(to);
    onClose();
  }, [navigate, to, onClose]);

  return (
    <ListItem disablePadding>
      <ListItemButton onClick={onClick}>
        <ListItemIcon>{children}</ListItemIcon>
        <ListItemText primary={primaryText} />
      </ListItemButton>
    </ListItem>
  );
}
