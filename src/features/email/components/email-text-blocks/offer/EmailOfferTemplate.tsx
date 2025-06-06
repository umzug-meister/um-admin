import { anrede, getPrintableDate, numberValue } from '../../../../../utils/utils';
import { Dotted } from '../Dotted';
import { EmailOfferOptions } from './EmailOfferOptions';

import { Order } from '@umzug-meister/um-core';
import { addDays } from 'date-fns';

export function EMailOfferTemplate({ order, rootOrder }: Readonly<{ order: Order; rootOrder?: Order }>) {
  let hasMontage = Boolean(order.from?.demontage || order.to?.montage);

  if (!hasMontage) {
    hasMontage = Boolean(rootOrder?.from?.montage || order?.to?.demontage);
  }

  return (
    <>
      <p>
        Bitte halten Sie bei Rückfragen folgende Nummer bereit:&nbsp;
        <strong>{rootOrder?.id || order.id}</strong>
      </p>
      <br />
      <p>{anrede(order.customer)}</p>
      <p>
        Vielen Dank für Ihre Anfrage. Gerne übernehmen wir Ihren Umzug&nbsp;
        <strong>
          am {getPrintableDate(order.date, true)} ab {order.time}, Alternativen nach Absprache
        </strong>
        &nbsp;und freuen uns, Ihnen folgende Konditionen anbieten zu können.&nbsp;
      </p>
      {order.volume > 0 && <p>Berechnetes Umzugsvolumen: {numberValue(order.volume)} m³</p>}
      {rootOrder && <h2 style={{ color: '#333' }}>1. Option</h2>}
      <EmailOfferOptions order={order} />
      {rootOrder && (
        <>
          <br />
          <h2 style={{ color: '#333' }}>2. Option</h2> <EmailOfferOptions order={rootOrder} />
        </>
      )}
      <br />
      <h3>Alle unseren Kostenvoranschläge beinhalten</h3>
      <Dotted>Anfahrt / Lastfahrtkosten</Dotted>
      {hasMontage && <Dotted>Möbelabbau und Aufbau</Dotted>}
      <Dotted>Bereitstellung eines Umzugswagens</Dotted>
      <Dotted>Versicherung: bis 2 Mio. Euro</Dotted>
      <Dotted>Be- und Entladen des LKWs</Dotted>
      <Dotted>Spanngurte, Dieselkosten sowie ausreichend Schutzdecken</Dotted>
      <Dotted>Ordentliche Rechnungsstellung</Dotted>
      <br />
      <p>
        Unser Kostenvoranschlag gilt bis zum {addDays(new Date(), 3).toLocaleDateString()}. <br />
        Im Anhang finden Sie den Auftrag. <strong>Wir bitten um Ihre Rückmeldung</strong> (Rückbestätigung per E-Mail
        ohne Unterschrift).
      </p>
    </>
  );
}
