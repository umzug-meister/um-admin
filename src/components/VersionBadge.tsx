import DisplaySettingsOutlinedIcon from '@mui/icons-material/DisplaySettingsOutlined';
import { Box, Card, Divider, Typography, useTheme } from '@mui/material';

export function VersionBadge() {
  const theme = useTheme();

  const appTitle = import.meta.env.VITE_APP_TARGET === 'umzugruckzuck' ? 'Umzug Ruck Zuck' : 'Umzug Ruck Zuck 24';

  return (
    <Card
      elevation={3}
      sx={{
        color: '#fff',
        background: theme.palette.primary.main,
        borderRadius: '8px',
      }}
    >
      <Box p={2} pb={1} display="flex" flexDirection="column" alignItems="center" gap={2}>
        <Box display="flex" justifyContent="center" flexDirection={'column'}>
          <Box display={'flex'} justifyContent="center">
            <DisplaySettingsOutlinedIcon fontSize="large" />
          </Box>
          <Typography variant="h5" textAlign={'center'}>
            Konfigurator
          </Typography>
          <Typography variant="subtitle2" textAlign={'center'}>
            {appTitle}
          </Typography>
          <Divider sx={{ my: 1, backgroundColor: 'white' }} />
          <Typography variant="subtitle2" textAlign={'center'}>
            Version: {import.meta.env.VITE_APP_VERSION}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}
