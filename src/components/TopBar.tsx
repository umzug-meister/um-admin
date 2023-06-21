import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';

import { useCallback, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { SideMenu } from './SideMenu';
import { OrderEditActions } from './order-actions';

export default function TopBar() {
  const [open, setOpen] = useState(false);

  const pageName = usePageName();
  const location = useLocation();

  const onClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const actions = useMemo(() => {
    if (location.pathname.startsWith('/edit')) {
      return <OrderEditActions />;
    }
    return null;
  }, [location]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar variant="outlined" color="inherit" position="fixed" elevation={0}>
        <Toolbar variant="dense">
          <IconButton
            color="inherit"
            onClick={() => {
              setOpen((open) => !open);
            }}
          >
            <MenuOutlinedIcon />
          </IconButton>

          <Typography pl={5} flex={1} variant="h5">
            {pageName}
          </Typography>
          <Box pr={4}>{actions}</Box>
        </Toolbar>
      </AppBar>

      <SideMenu open={open} onClose={onClose} />
    </Box>
  );
}

function usePageName() {
  const params = useParams();
  const location = useLocation();

  const pageName = useMemo(() => {
    if (/edit\/[0-9]/gm.test(location.pathname)) {
      return `Auftrag ${params.id}`;
    }

    switch (location.pathname) {
      case '/':
        return 'Alle Aufträge';

      case '/edit/-1':
        return 'Neuer Auftrag';

      case '/import':
        return 'Auftrag importieren';

      case '/blanco':
        return 'Neue Rechnung';

      case '/settings':
        return 'Optionen';

      case '/settings/services':
        return 'Leistungen';

      case '/settings/packings':
        return 'Verpackung';

      case '/settings/furniture':
        return 'Möbel';

      case '/settings/offers':
        return 'Angebote';

      case '/settings/categories':
        return 'Möbel Kategorien';

      default:
        return '';
    }
  }, [location, params]);

  return pageName;
}
