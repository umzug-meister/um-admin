import { Divider, Stack } from '@mui/material';

import { Link, Outlet } from 'react-router-dom';

import { RootBox } from '../components/shared/RootBox';

export default function Settings() {
  return (
    <RootBox>
      <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={2}>
        <Link to="/settings">Optionen</Link>
        <Link to="services">Leistungen</Link>
        <Link to="packings">Verpackung</Link>
        <Link to="prices">Preise</Link>
        <Link to="furniture">Möbel</Link>
        <Link to="categories">Möbel-Kategorien</Link>
      </Stack>
      <Outlet />
    </RootBox>
  );
}
