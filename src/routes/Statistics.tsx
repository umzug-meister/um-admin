import { Box, Card, Divider, Stack } from '@mui/material';

import { Link, Outlet } from 'react-router-dom';

import { RootBox } from '../components/shared/RootBox';

export default function Statistics() {
  return (
    <RootBox>
      <Card elevation={0}>
        <Box p={2}>
          <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={2}>
            <Link to="">Anfragen</Link>
            {/* <Link to="offers">Angebote</Link> */}
          </Stack>
        </Box>
      </Card>
      <Outlet />
    </RootBox>
  );
}
