import { Box, Button, Card, Stack } from '@mui/material';

import React from 'react';
import { Link, Outlet } from 'react-router-dom';

import { RootBox } from '../components/shared/RootBox';

export default function Settings() {
  return (
    <RootBox>
      <Card elevation={0}>
        <Box p={2}>
          <Stack direction="row" spacing={2}>
            <OptionLink to="">Optionen</OptionLink>
            <OptionLink to="packings">Verpackung</OptionLink>
            <OptionLink to="services">Leistungen</OptionLink>
            <OptionLink to="offers">Angebote</OptionLink>
            <OptionLink to="furniture">Möbel</OptionLink>
            <OptionLink to="categories">Möbel-Kategorien</OptionLink>
          </Stack>
        </Box>
      </Card>
      <Outlet />
    </RootBox>
  );
}

const OptionLink = ({ children, to }: React.PropsWithChildren<{ to: string }>) => {
  return (
    <Link to={to}>
      <Button size="small">{children}</Button>
    </Link>
  );
};
