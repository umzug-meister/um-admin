import { Box, Card, Divider, Stack } from '@mui/material';

import { Link, Outlet } from 'react-router-dom';

import { RootBox } from '../components/shared/RootBox';

export default function Settings() {
  return (
    <RootBox>
      <Card variant="outlined">
        <Box p={2}>
          <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={2}>
            <Link to="">Optionen</Link>
            <Link to="packings">Verpackung</Link>
            <Link to="services">Leistungen</Link>
            <Link to="offers">Angebote</Link>
            <Link to="furniture">Möbel</Link>
            <Link to="categories">Möbel-Kategorien</Link>
          </Stack>
        </Box>
      </Card>
      <Outlet />
    </RootBox>
  );
}
