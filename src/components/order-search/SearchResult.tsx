import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined';
import { Box, Card, Chip, ChipProps, Typography, useTheme } from '@mui/material';

import { Link } from 'react-router-dom';

import { getAmountOfParkingSlots, getCustomerFullname, getPrintableDate } from '../../utils/utils';

import { Order } from 'um-types';

const format = new Intl.DateTimeFormat('de-DE', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export function SearchResult({ order }: Readonly<{ order: Order }>) {
  const { id, date, from, to } = order;
  const { palette } = useTheme();

  return (
    <Link to={`/edit/${id}`} target="_blank" style={{ textDecoration: 'none' }}>
      <Card
        variant="outlined"
        sx={{
          borderRadius: 4,
          backgroundColor: palette.background.default,
          borderColor: palette.divider,
          '& :hover': {
            backgroundColor: palette.background.paper,
          },
        }}
      >
        <Box p={1} display={'flex'} justifyContent={'space-between'}>
          <Box>
            <Typography variant="subtitle2">
              {id} | {getCustomerFullname(order)}
            </Typography>
            <Typography variant="caption">
              {from?.address} - {to?.address}
            </Typography>
            <OrderResources order={order} />
          </Box>
          <Box display="flex" flexDirection={'column'} justifyContent={'space-between'}>
            <Box>
              <Typography align="right" variant="subtitle2">
                Umzug am: {getPrintableDate(date)}
              </Typography>

              {typeof order.lupd === 'number' && (
                <Typography variant="caption">Aktualisiert am: {format.format(new Date(order.lupd))}</Typography>
              )}
            </Box>
            <Box display={'flex'} justifyContent={'flex-end'}>
              <LaunchOutlinedIcon color="disabled" fontSize="small" />
            </Box>
          </Box>
        </Box>
      </Card>
    </Link>
  );
}

function OrderResources({ order }: Readonly<{ order: Order }>) {
  const { timeBased, transporterNumber, workersNumber } = order;

  const chipProps: ChipProps = {
    size: 'small',
    variant: 'outlined',
    color: 'info',
  };

  const parkingSlots = getAmountOfParkingSlots(order);

  return (
    <Box mt={1} display={'flex'} gap={2}>
      {Boolean(workersNumber) && <Chip {...chipProps} label={`Mann: ${workersNumber}`} />}
      {Boolean(transporterNumber) && <Chip {...chipProps} label={`LKW: ${transporterNumber}`} />}
      {Boolean(timeBased?.hours) && <Chip {...chipProps} label={`Stunden: ${timeBased.hours}`} />}
      {Boolean(timeBased?.basis) && <Chip {...chipProps} label={`${timeBased.basis}€`} />}
      {Boolean(parkingSlots) && <Chip {...chipProps} label={`HVZ: ${parkingSlots}`} />}
    </Box>
  );
}
