import { Box, Grid, TextField } from '@mui/material';

import { useCurrentOrder } from '../../hooks/useCurrentOrder';
import OrderField from '../OrderField';
import { AppCard } from '../shared/AppCard';

export default function DateTime() {
  return (
    <Grid item xs={4}>
      <AppCard title="Termin">
        <AppointmentRange />
        <OrderField path="date" label="Datum" as="date" />
        <OrderField path="time" label="Uhrzeit" type="time" />
      </AppCard>
    </Grid>
  );
}

function AppointmentRange() {
  const order = useCurrentOrder();

  if (!order) {
    return null;
  }
  if (order?.date_from && order.date_to) {
    return (
      <Box display="flex" gap={2}>
        <TextField size="small" label="Von" fullWidth disabled value={order.date_from}></TextField>
        <TextField size="small" label="Bis" fullWidth disabled value={order.date_to}></TextField>
      </Box>
    );
  }

  return null;
}
