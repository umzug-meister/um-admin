import { Grid2, Typography } from '@mui/material';

import { useCurrentOrder } from '../../hooks/useCurrentOrder';
import { getParseableDate } from '../../utils/utils';
import OrderField from '../OrderField';
import { AppCard } from '../shared/AppCard';

export default function DateTime() {
  return (
    <Grid2 size={4}>
      <AppCard title="Termin">
        <AppointmentRange />
        <OrderField path="date" label="Datum" as="date" />
        <OrderField path="time" label="Uhrzeit" type="time" />
      </AppCard>
    </Grid2>
  );
}

function AppointmentRange() {
  const order = useCurrentOrder();

  if (order?.date_from && order?.date_to) {
    const formater = new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      weekday: 'short',
    });
    const startDate = new Date(getParseableDate(order.date_from));
    const endDate = new Date(getParseableDate(order.date_to));
    const value = formater.formatRange(startDate, endDate);
    return <Typography variant="h6">{value}</Typography>;
  }

  return null;
}
