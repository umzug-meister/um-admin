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
      <h3>Kostenvoranschlag</h3>
      <p>
        {`Bei Rückfragen, bitte folgende ID bereithalten: `}
        <strong>{order.id}</strong>
      </p>
      <br />
      <p>{anrede(order.customer)}</p>
      <p>
        {`gerne übernehmen wir Ihren Umzug am `}
        <strong>
          {getPrintableDate(order.date, true)} um {order.time} Uhr.
        </strong>
      </p>
      {order.volume && (
        <p>
          <strong>Umzugsgut: {f.format(Number(order.volume))} m³</strong>
        </p>
      )}
      <br />
      <p>Unser Kostenvoranschlag beinhaltet:</p>
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
      <p style={{ color: 'blue' }}>
        <strong>Im Anhang erhalten Sie den Auftrag.</strong>
      </p>
      <p style={{ color: 'blue' }}>
        <strong>Ich bitte um Ihre Rückmeldung (Rückbestätigung per E-Mail ohne Unterschrift).</strong>
      </p>
      <p style={{ color: 'red' }}>
        {`Nutzen Sie unseren `}
        <a href="https://umzugruckzuck.de/umzug-muenchen-kartonrechner/">Kartonrechner</a>, um die Anzahl der Kartons zu
        schätzen!
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
