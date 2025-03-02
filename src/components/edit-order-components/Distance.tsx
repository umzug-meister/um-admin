import ArrowRightAltOutlinedIcon from '@mui/icons-material/ArrowRightAltOutlined';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import FlagCircleOutlinedIcon from '@mui/icons-material/FlagCircleOutlined';
import FunctionsOutlinedIcon from '@mui/icons-material/FunctionsOutlined';
import { Card, Stack, Typography } from '@mui/material';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useOption } from '../../hooks/useOption';
import { AppDispatch, AppState } from '../../store';
import { updateOrderProps } from '../../store/appReducer';
import { AppCard } from '../shared/AppCard';

import { Loader } from '@googlemaps/js-api-loader';
import { Order } from '@umzug-meister/um-core';
import { clearCountry } from '@umzug-meister/um-core/utils';

const distanceInKm = (distance = 0) => Number(distance / 1000).toFixed(0);
export default function Distance() {
  const origin = useOption('origin');

  const [response, setResponse] = useState<google.maps.DistanceMatrixResponse | null>();

  const loaderRef = useRef<Loader | null>(null);

  const dispatch = useDispatch<AppDispatch>();

  const order = useSelector<AppState, Order | null>((s) => s.app.current);

  const gapiKey = import.meta.env.VITE_GOOGLE_API_KEY;

  const from = order?.from?.address;
  const to = order?.to?.address;
  const secondaryFrom = order?.secondaryFrom?.address;
  const secondaryTo = order?.secondaryTo?.address;

  const origins = [origin, from, secondaryFrom, to, secondaryTo].filter((s) => s !== undefined);
  const destinations = [from, secondaryFrom, to, secondaryTo, origin].filter((s) => s !== undefined);

  useEffect(() => {
    if (loaderRef.current == null) {
      loaderRef.current = new Loader({
        apiKey: gapiKey,
        language: 'de',
      });
    }
    loaderRef.current
      .importLibrary('routes')
      .then((google) => {
        const service = new google.DistanceMatrixService();
        if (from && to) {
          service.getDistanceMatrix(
            {
              travelMode: google.TravelMode.DRIVING,
              origins,
              destinations,
            },
            setResponse,
          );
        }
      })
      .catch(console.log);
  }, [gapiKey, origin, from, to, secondaryFrom, secondaryTo]);

  const sum = useMemo(() => {
    const sumInMeter = response?.rows.reduce(
      (result, row, index) => result + (row.elements[index]?.distance?.value || 0),
      0,
    );
    return distanceInKm(sumInMeter);
  }, [response]);

  useEffect(() => {
    if (String(order?.distance) !== sum && sum !== '0') {
      dispatch(updateOrderProps({ path: ['distance'], value: sum }));
    }
  }, [dispatch, sum, order?.distance]);

  if (!gapiKey) {
    return null;
  }

  return (
    <AppCard title="Fahrstrecke">
      <Stack spacing={4} direction={'row'} alignItems={'center'}>
        {[origin, ...destinations].map((address, index) => {
          let icon = undefined;

          if (index === 0) {
            icon = <CircleOutlinedIcon color="success" />;
          }
          if (index === destinations.length) {
            icon = <FlagCircleOutlinedIcon color="error" />;
          }

          let responseElement = undefined;

          if (index < destinations.length) responseElement = response?.rows[index]?.elements[index];

          return (
            <>
              <Place key={index} address={address} />
              {responseElement && <Connector {...responseElement} />}
            </>
          );
        })}
        <Stack paddingLeft={4} direction="row" spacing={1} alignItems="center">
          <Typography variant="h5" color="warning">
            Gesamt: {sum} km
          </Typography>
        </Stack>
      </Stack>
    </AppCard>
  );
}

interface PlaceProps {
  address: string;
}

function Place({ address }: PlaceProps) {
  const [street, city] = clearCountry(address).split(', ');
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Stack spacing={0}>
        <Typography fontWeight={'bold'} variant="caption">
          {street}
        </Typography>
        <Typography variant="caption">{city}</Typography>
      </Stack>
    </Stack>
  );
}

function Connector({ distance, duration }: google.maps.DistanceMatrixResponseElement) {
  return (
    <Stack justifyContent={'center'} alignItems={'center'}>
      <Typography color="primary" variant="caption">
        {distance?.text}
      </Typography>
      <ArrowRightAltOutlinedIcon color="primary" fontSize="large" />
      <Typography color="primary" variant="caption">
        {duration?.text}
      </Typography>
    </Stack>
  );
}
