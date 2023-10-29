import { Avatar, Box, Card, Typography, useTheme } from '@mui/material';

export function VersionBadge() {
  const theme = useTheme();

  const local = process.env.REACT_APP_VERSION || '0.0.0';

  return (
      <Card
        elevation={3}
        sx={{
          color: 'white',
          background: theme.palette.primary.light,
          borderRadius: '8px',
        }}
      >
        <Box p={2} pb={1} display="flex" flexDirection="column" alignItems="center" gap={2}>
          <Avatar
            variant="square"
            sx={{ width: 100, height: 105 }}
            alt="logo"
            src={process.env.PUBLIC_URL + '/logo.png'}
          />
          <Box display="flex" justifyContent="center">
            <Typography variant="subtitle2">Version: {local}</Typography>
          </Box>
        </Box>
      </Card>
  );
}
