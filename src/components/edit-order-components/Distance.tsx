import ArrowRightAltOutlinedIcon from '@mui/icons-material/ArrowRightAltOutlined';
import { Stack, Typography } from '@mui/material';

import { Fragment, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useOption } from '../../hooks/useOption';
import { AppDispatch, AppState } from '../../store';
import { updateOrderProps } from '../../store/appReducer';
import { AppCard } from '../shared/AppCard';

import { Loader } from '@googlemaps/js-api-loader';
import { Order } from '@umzug-meister/um-core';
import { clearCountry } from '@umzug-meister/um-core/utils';
import { isEqual } from 'lodash';

const distanceInKm = (distance = 0) => Number(distance / 1000).toFixed(0);

interface DistanceProps {
  response: google.maps.DistanceMatrixResponse | null;
  setResponse: (response: google.maps.DistanceMatrixResponse | null) => void;
}

function isAddress(s: string | undefined | null) {
  if (typeof s == 'string' && s.length > 0) {
    return true;
  }
  return false;
}

function shouldRecalculate(
  response: google.maps.DistanceMatrixResponse | null,
  origins: string[],
  destinations: string[],
): boolean {
  if (response == null) return true;

  const currentOrigins = [...response.originAddresses].map((address) => clearCountry(address));
  const currentDestinations = [...response.destinationAddresses].map((address) => clearCountry(address));

  const originsEqual = isEqual(currentOrigins, origins);
  const destinationsEqual = isEqual(currentDestinations, destinations);

  return !originsEqual || !destinationsEqual;
}

export default function Distance({ response, setResponse }: Readonly<DistanceProps>) {
  const origin = useOption('origin');

  const loaderRef = useRef<Loader | null>(null);

  const dispatch = useDispatch<AppDispatch>();

  const order = useSelector<AppState, Order | null>((s) => s.app.current);

  const gapiKey = import.meta.env.VITE_GOOGLE_API_KEY;

  const from = order?.from?.address;
  const to = order?.to?.address;
  const secondaryFrom = order?.secondaryFrom?.address;
  const secondaryTo = order?.secondaryTo?.address;

  const origins = [origin, from, secondaryFrom, to, secondaryTo].filter(isAddress) as string[];
  const destinations = [from, secondaryFrom, to, secondaryTo, origin].filter(isAddress) as string[];

  const _shouldRecalculate = shouldRecalculate(response, origins, destinations);

  useEffect(() => {
    if (!_shouldRecalculate) return;
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
        console.log('Recalculating distance');

        service.getDistanceMatrix(
          {
            travelMode: google.TravelMode.DRIVING,
            origins,
            destinations,
          },
          setResponse,
        );
      })
      .catch(console.log);
  }, [gapiKey, origin, from, to, secondaryFrom, secondaryTo, _shouldRecalculate]);

  const sumInMeter = response?.rows.reduce(
    (result, row, index) => result + (row.elements[index]?.distance?.value || 0),
    0,
  );

  const sum = distanceInKm(sumInMeter);

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
          let responseElement = undefined;

          if (index < destinations.length) responseElement = response?.rows[index]?.elements[index];

          return (
            <Fragment key={`${address}-${index}`}>
              <Place address={address} />
              {responseElement && <Connector {...responseElement} />}
            </Fragment>
          );
        })}
        <Stack paddingLeft={4} direction="row" spacing={1} alignItems="center">
          <Typography variant="h5" color="primary">
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
