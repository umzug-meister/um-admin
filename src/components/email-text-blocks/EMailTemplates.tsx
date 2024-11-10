import { Box } from '@mui/material';

import { PropsWithChildren } from 'react';

import { anrede, getPrintableDate, numberValue } from '../../utils/utils';
import { EmailServicesTable } from './EmailServicesTable';
import { SumTemplate } from './SumTemplate';
import { WorkerCosts } from './WorkerCosts';

import { addDays } from 'date-fns';
import { Order } from 'um-types';

interface RootProps {
  elementID: string;
}

export function EMailTextTemplate({ order }: Readonly<{ order: Order }>) {
  const hasMontage = Boolean(order.from?.demontage || order.to?.montage);

  return (
    <>
      <p>
        {`Bitte halten Sie bei Rückfragen folgende Nummer bereit: `}
        <strong>{order.id}</strong>
      </p>
      <p>{anrede(order.customer)}</p>
      <p>
        gerne übernehmen wir Ihren Umzug am
        {' ' + getPrintableDate(order.date, true)} ab {order.time} Uhr.
      </p>
      {Boolean(order.volume) && <p>Umzugsgut: {numberValue(order.volume)} m³</p>}
      <h2>Kostenvoranschlag</h2>
      <p>Unser Kostenvoranschlag beinhaltet:</p>
      <ul>
        <li>Anfahrt / Lastfahrtkosten</li>
        {hasMontage && <li>Möbeldemontage/Montage</li>}
        <li>Bereitstellung eines Umzugswagens</li>
        <li>Versicherung: bis 2 Mio. Euro</li>
        <li>Be- und Entladen des LKWs</li>
        <li>Spanngurte, Dieselkosten sowie ausreichend Schutzdecken</li>
        <li>Ordentliche Rechnungsstellung</li>
      </ul>

      <EmailServicesTemplate order={order} />

      <br />
      <p>{`Unser Kostenvoranschlag gilt bis zum ${getPrintableDate(addDays(new Date(), 3).toDateString())}.`}</p>
      <p style={{ color: 'blue' }}>
        <strong>
          Im Anhang finden Sie den Auftrag. Wir bitten um Ihre Rückmeldung (Rückbestätigung per E-Mail ohne
          Unterschrift).
        </strong>
      </p>

      <p style={{ color: 'red' }}>
        {`Nutzen Sie unseren `}
        <a href="https://umzugruckzuck.de/umzug-muenchen-kartonrechner/">Kartonrechner</a>, um die benötigte Anzahl an
        Kartons zu schätzen!
      </p>
      <strong>
        --
        <br />
        Sollten Sie Interesse nach Renovierungs- und Ausbesserungsarbeiten haben, kontaktieren Sie bitte unseren
        Partner: 0176 305 451 65.
      </strong>
    </>
  );
}

export function EmailServicesTemplate({ order }: Readonly<{ order: Order }>) {
  return (
    <>
      <WorkerCosts order={order} />
      <EmailServicesTable order={order} />
      <SumTemplate order={order} />
    </>
  );
}

export function RootElement({ elementID, children }: PropsWithChildren<RootProps>) {
  return (
    <Box
      id={elementID}
      sx={{
        fontSize: '14px',
        fontFamily: 'Arial, Helvetica, sans-serif',
      }}
    >
      {children}
    </Box>
  );
}
