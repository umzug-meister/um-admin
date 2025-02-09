import { Avatar, Box, Card, Typography } from '@mui/material';

import logoUrl from '../assets/logo.png';

export function VersionBadge() {
  return (
    <Card
      elevation={3}
      sx={{
        color: '#fff',
        background: '#42a5f5',
        borderRadius: '8px',
      }}
    >
      <Box p={2} pb={1} display="flex" flexDirection="column" alignItems="center" gap={2}>
        <Avatar variant="square" sx={{ width: 100, height: 105 }} alt="logo" src={logoUrl} />
        <Box display="flex" justifyContent="center">
          <Typography data-hj-allow variant="subtitle2">
            Version: {import.meta.env.PACKAGE_VERSION}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}
