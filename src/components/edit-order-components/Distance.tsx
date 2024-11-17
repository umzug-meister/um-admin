import { Table, TableBody, TableCell, TableHead, TableRow, styled } from '@mui/material';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useOption } from '../../hooks/useOption';
import { AppDispatch, AppState } from '../../store';
import { updateOrderProps } from '../../store/appReducer';
import { AppCard } from '../shared/AppCard';

import { Loader } from '@googlemaps/js-api-loader';
import { Order } from 'um-types';
import { clearCountry } from 'um-types/utils';

export default function Distance() {
  const origin = useOption('origin');

  const [response, setResponse] = useState<google.maps.DistanceMatrixResponse | null>();

  const loaderRef = useRef<Loader | null>(null);

  const dispatch = useDispatch<AppDispatch>();

  const order = useSelector<AppState, Order | null>((s) => s.app.current);

  const gapiKey = import.meta.env.VITE_GAPI_KEY;
  const from = order?.from?.address;
  const to = order?.to?.address;

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
              origins: [origin, from, to],
              destinations: [from, to, origin],
            },
            setResponse,
          );
        }
      })
      .catch(console.log);
  }, [gapiKey, origin, from, to]);

  const sum = useMemo(() => {
    const sumInMeter = response?.rows.reduce(
      (result, row, index) => result + (row.elements[index].distance?.value || 0),
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
      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <BoldTableCell>Von</BoldTableCell>
            <BoldTableCell>Nach</BoldTableCell>
            <BoldTableCell>Strecke</BoldTableCell>
            <BoldTableCell>Fahrtzeit</BoldTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <DistanceRow label="Anfahrt" response={response} index={0} />
          <DistanceRow label="Lastfahrt" response={response} index={1} />
          <DistanceRow label="Rückfahrt" response={response} index={2} />

          <TableRow>
            <BoldTableCell colSpan={3}>Gesamt</BoldTableCell>

            <TableCell colSpan={2}>{sum} km</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </AppCard>
  );
}

function DistanceRow({
  label,
  index,
  response,
}: {
  label: string;
  index: number;
  response: google.maps.DistanceMatrixResponse | null | undefined;
}) {
  if (!response) {
    return null;
  }

  const { originAddresses, destinationAddresses, rows } = response;
  const elem = rows[index].elements[index];

  return (
    <TableRow>
      <BoldTableCell>{label}</BoldTableCell>
      <TableCell>{clearCountry(originAddresses[index])}</TableCell>
      <TableCell>{clearCountry(destinationAddresses[index])}</TableCell>
      <TableCell>{distanceInKm(elem.distance?.value)} km</TableCell>
      <TableCell>{elem.duration?.text}</TableCell>
    </TableRow>
  );
}

const distanceInKm = (distance = 0) => Number(distance / 1000).toFixed(0);

const BoldTableCell = styled(TableCell)({
  fontWeight: 'bold',
});
