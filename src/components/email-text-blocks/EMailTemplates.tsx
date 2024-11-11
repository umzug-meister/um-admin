import { Box } from '@mui/material';

import { PropsWithChildren } from 'react';

import { anrede, getPrintableDate, numberValue } from '../../utils/utils';
import { Dotted } from './Dotted';
import { Discount, EmailServicesTable } from './EmailServicesTable';
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
      <br />
      <p>{anrede(order.customer)}</p>
      <p>
        Vielen Dank für Ihre Anfrage. Wir freuen uns, Ihnen folgendes Angebot unterbreiten zu können. Gerne übernehmen
        wir Ihren Umzug{' '}
        <strong>
          am {getPrintableDate(order.date, true)} ab {order.time} Uhr.
        </strong>
      </p>
      {Boolean(order.volume) && <p>Berechnetes Umzugsgut: {numberValue(order.volume)} m³</p>}
      <br />
      <h3>🚛 Kostenvoranschlag</h3>
      <p>Unser Kostenvoranschlag beinhaltet:</p>
      <Dotted>Anfahrt / Lastfahrtkosten</Dotted>
      {hasMontage && <Dotted> Möbeldemontage und Montage</Dotted>}
      <Dotted>Bereitstellung eines Umzugswagens</Dotted>
      <Dotted>Versicherung: bis 2 Mio. Euro</Dotted>
      <Dotted>Be- und Entladen des LKWs</Dotted>
      <Dotted>Spanngurte, Dieselkosten sowie ausreichend Schutzdecken</Dotted>
      <Dotted>Ordentliche Rechnungsstellung</Dotted>
      <EmailServicesTemplate order={order} />
      <br />
      <p>
        Unser Kostenvoranschlag gilt bis zum {getPrintableDate(addDays(new Date(), 3).toDateString())}. <br />
        Im Anhang finden Sie den Auftrag. <strong>Wir bitten um Ihre Rückmeldung</strong> (Rückbestätigung per E-Mail
        ohne Unterschrift).
      </p>
    </>
  );
}

export function EmailServicesTemplate({ order }: Readonly<{ order: Order }>) {
  return (
    <>
      <WorkerCosts order={order} />
      <EmailServicesTable order={order} />
      <Discount order={order} />
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
