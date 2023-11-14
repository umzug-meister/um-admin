import { Box } from '@mui/material';

import React from 'react';

import { anrede, getPrintableDate } from '../../utils/utils';
import { BaseHoursAndPrice } from './EmailBaseHoursAndPrice';
import { EmailExtraHours } from './EmailExtraHours';
import { EmailPersons } from './EmailPersons';
import { EmailServicesTable } from './EmailServicesTable';

import { Order } from 'um-types';

interface CoreProps {
  order: Order;
}

interface RootProps {
  elementID: string;
}

export function EMailTextTemplate({ order }: CoreProps) {
  const f = new Intl.NumberFormat('de-DE');

  const hasMontage = order.from?.demontage || order.to?.montage;

  return (
    <>
      <p style={{ textDecoration: 'underline', fontWeight: 'bold' }}>Kostenvoranschlag</p>
      <p>
        Bei Rückfragen, bitte folgende ID bereithalten:
        <i style={{ fontStyle: 'normal', fontWeight: 'bold' }}>{` ${order.id || '---1'}`}</i>
      </p>
      <p>{anrede(order.customer)}</p>
      <p>
        {`gerne übernehmen wir Ihren Umzug am `}
        <strong>
          {getPrintableDate(order.date)} um {order.time} Uhr.
        </strong>
      </p>
      {order.volume && <p style={{ fontWeight: 'bold' }}>Umzugsgut: {f.format(Number(order.volume))} m³</p>}
      <br />
      <p style={{ textDecoration: 'bold' }}>Unser Kostenvoranschlag beinhaltet:</p>
      <ul>
        <li>Anfahrt / Lastfahrtkosten</li>
        {hasMontage ? <li>Möbeldemontage/Montage</li> : null}
        <li>Bereitstellung eines Umzugswagens</li>
        <li>Versicherung: bis 2 Mio. Euro</li>
        <li>Be- und Entladen des LKWs</li>
        <li>Spanngurte, Dieselkosten sowie ausreichend Schutzdecken</li>
        <li>Ordentliche Rechnungsstellung</li>
      </ul>

      <EmailServicesTemplate order={order} />

      <br />
      <p>{`Unser Kostenvoranschlag gilt bis zum ${new Date().addDays(3).toLocaleDateString('ru')}.`}</p>
      <p style={{ color: 'blue', fontWeight: 'bold' }}>Im Anhang erhalten Sie den Auftrag.</p>
      <p style={{ color: 'blue', fontWeight: 'bold' }}>
        Ich bitte um Ihre Rückmeldung (Rückbestätigung per E-Mail ohne Unterschrift).
      </p>
      <p style={{ color: 'red' }}>
        {` Nutzen Sie unseren `}
        <a href="https://umzugruckzuck.de/umzug-muenchen-kartonrechner/">Kartonrechner</a>, um die Anzahl der Kartons zu
        schätzen!
      </p>
      <p style={{ fontWeight: 'bold' }}>
        --
        <br />
        Sollten Sie Interesse nach Renovierungs- und Ausbesserungsarbeiten haben, kontaktieren Sie bitte unseren
        Partner: 0176 305 451 65.
      </p>
    </>
  );
}

export function EmailServicesTemplate({ order }: Readonly<CoreProps>) {
  return (
    <>
      <EmailPersons order={order} />
      <BaseHoursAndPrice order={order} />
      <EmailExtraHours timeBased={order.timeBased} />
      <br />
      <EmailServicesTable order={order} />
    </>
  );
}

export function RootElement({ elementID, children }: React.PropsWithChildren<RootProps>) {
  return (
    <Box
      id={elementID}
      sx={{
        fontSize: '14px',
        fontFamily: 'Arial, Helvetica, sans-serif',
        color: 'black',
      }}
    >
      {children}
    </Box>
  );
}
