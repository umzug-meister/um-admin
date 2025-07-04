import ArrowRightAltOutlinedIcon from '@mui/icons-material/ArrowRightAltOutlined';
import { Button, Stack, Typography } from '@mui/material';

import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useOption } from '../../hooks/useOption';
import { AppDispatch, AppState } from '../../store';
import { updateOrderProps } from '../../store/appReducer';
import { AppCard } from '../shared/AppCard';

import { Loader } from '@googlemaps/js-api-loader';
import { Order } from '@umzug-meister/um-core';
import { clearCountry } from '@umzug-meister/um-core/utils';

const distanceInKm = (distance = 0) => Number(distance / 1000).toFixed(0);

async function initDistanceMatrixService(gapiKey: string | null): Promise<null | google.maps.DistanceMatrixService> {
  if (!gapiKey) {
    console.error('Google Maps API key is not set.');
    return null;
  }

  const loader = new Loader({
    apiKey: gapiKey,
    language: 'de',
  });

  return loader
    .importLibrary('routes')
    .then((google) => {
      return new google.DistanceMatrixService();
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
}

export default function Distance() {
  const origin = useOption('origin');

  const [response, setResponse] = useState<google.maps.DistanceMatrixResponse | null>();

  const serviceRef = useRef<google.maps.DistanceMatrixService | null>(null);

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
    if (serviceRef.current == null) {
      initDistanceMatrixService(gapiKey).then((service) => {
        if (!service) {
          console.error('Google Maps Distance Matrix Service could not be initialized.');
          return;
        }
        serviceRef.current = service;
      });
    }
  }, [gapiKey, origin, from, to, secondaryFrom, secondaryTo]);

  const totalDistanceInMeters = response?.rows.reduce(
    (result, row, index) => result + (row.elements[index]?.distance?.value || 0),
    0,
  );

  const distance = distanceInKm(totalDistanceInMeters);

  const calculateDistance = useCallback(() => {
    if (origins.length > 0 && destinations.length > 0 && serviceRef.current) {
      serviceRef.current?.getDistanceMatrix(
        {
          travelMode: google.maps.TravelMode.DRIVING,
          origins,
          destinations,
        },
        setResponse,
      );
    }
  }, [destinations, origins]);

  useEffect(() => {
    if (String(order?.distance) !== distance && distance !== '0') {
      dispatch(updateOrderProps({ path: ['distance'], value: distance }));
    }
  }, [dispatch, distance, order?.distance]);

  if (!gapiKey) {
    return null;
  }

  return (
    <AppCard title="Fahrstrecke">
      <Stack spacing={4} direction={'row'} alignItems={'center'}>
        {response ? (
          [origin, ...destinations].map((address, index) => {
            let responseElement = undefined;

            if (index < destinations.length) responseElement = response?.rows[index]?.elements[index];

            return (
              <Fragment key={`${address}-${index}`}>
                <Place address={address} />
                {responseElement && <Connector {...responseElement} />}
              </Fragment>
            );
          })
        ) : (
          <Button variant="contained" onClick={calculateDistance}>
            Strecke anzeigen
          </Button>
        )}

        <Stack paddingLeft={4} direction="row" spacing={1} alignItems="center">
          <Typography variant="h5" color="primary">
            Gesamt: {order?.distance} km
          </Typography>
        </Stack>
      </Stack>
    </AppCard>
  );
}

interface PlaceProps {
  address: string;
}

function Place({ address }: Readonly<PlaceProps>) {
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

function Connector({ distance, duration }: Readonly<google.maps.DistanceMatrixResponseElement>) {
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
