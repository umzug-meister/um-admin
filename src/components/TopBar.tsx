import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';

import { useCallback, useMemo, useState } from 'react';
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';

import RootActions from './RootActions';
import { SideMenu } from './SideMenu';
import { OrderEditActions } from './order-actions';
import OrderSearch from './order-search';
import { HomeOutlined } from '@mui/icons-material';

export default function TopBar() {
  const [open, setOpen] = useState(false);

  const pageName = usePageName();
  const location = useLocation();

  const onClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const endActions = useMemo(() => {
    if (location.pathname.startsWith('/edit')) {
      return <OrderEditActions />;
    } else {
      return <RootActions />;
    }
  }, [location]);

  const startActions = useMemo(() => {
    if (location.pathname === '/') {
      return null;
    }
    return (
      <Box marginX={2}>
        <OrderSearch />
      </Box>
    );
  }, [location]);

  const mainAction = useMemo(() => {
    return (
      <Box display={'flex'} gap={1}>
        <IconButton
          color="inherit"
          onClick={() => {
            setOpen((open) => !open);
          }}
        >
          <MenuOutlinedIcon />
        </IconButton>
        {location.pathname !== '/' && (
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <IconButton color="inherit">
              <HomeOutlined />
            </IconButton>
          </Link>
        )}
      </Box>
    );
  }, [location]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar variant="outlined" color="inherit" position="fixed" elevation={0}>
        <Toolbar variant="dense">
          {mainAction}
          {startActions}
          <Typography margin="auto" variant="h5">
            {pageName}
          </Typography>
          <Box>{endActions}</Box>
        </Toolbar>
      </AppBar>

      <SideMenu open={open} onClose={onClose} />
    </Box>
  );
}

function usePageName() {
  const params = useParams();
  const location = useLocation();
  const [sp] = useSearchParams();

  if (/edit\/\d/gm.test(location.pathname)) {
    return `Auftrag ${params.id}`;
  }

  switch (location.pathname) {
    case '/':
      return 'Aufträge'.concat(sp.get('page') ? `, Seite ${sp.get('page')}` : '');

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
}
