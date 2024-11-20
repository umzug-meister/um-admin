import { anrede, getPrintableDate, numberValue } from '../../../../../utils/utils';
import { Dotted } from '../Dotted';
import { EmailOfferOptions } from './EmailOfferOptions';

import { addDays } from 'date-fns';
import { Order } from 'um-types';

export function EMailOfferTemplate({ order, rootOrder }: Readonly<{ order: Order; rootOrder?: Order }>) {
  let hasMontage = Boolean(order.from?.demontage || order.to?.montage);

  if (!hasMontage) {
    hasMontage = Boolean(rootOrder?.from?.montage || order?.to?.demontage);
  }

  return (
    <>
      <p>
        Bitte halten Sie bei Rückfragen folgende Nummer bereit:&nbsp;
        <strong>{order.id}</strong>
      </p>
      <br />
      <p>{anrede(order.customer)}</p>
      <p>
        Vielen Dank für Ihre Anfrage. Gerne übernehmen wir Ihren Umzug&nbsp;
        <strong>
          am {getPrintableDate(order.date, true)} ab {order.time} Uhr
        </strong>
        &nbsp;und freuen uns, Ihnen folgende Konditionen anbieten zu können.&nbsp;
        {rootOrder && `Wir bieten Ihnen zwei Optionen an.`}
      </p>
      {order.volume > 0 && <p>Berechnetes Umzugsvolumen: {numberValue(order.volume)} m³</p>}
      <br />
      <h3>🚛 Kostenvoranschlag</h3>
      <p>Alle unseren Kostenvoranschläge beinhaltet:</p>
      <Dotted>Anfahrt / Lastfahrtkosten</Dotted>
      {hasMontage && <Dotted>Möbeldemontage und Montage</Dotted>}
      <Dotted>Bereitstellung eines Umzugswagens</Dotted>
      <Dotted>Versicherung: bis 2 Mio. Euro</Dotted>
      <Dotted>Be- und Entladen des LKWs</Dotted>
      <Dotted>Spanngurte, Dieselkosten sowie ausreichend Schutzdecken</Dotted>
      <Dotted>Ordentliche Rechnungsstellung</Dotted>
      {rootOrder && <h2 style={{ textAlign: 'center' }}>Option 1</h2>}
      <EmailOfferOptions order={order} />
      {rootOrder && (
        <>
          <h2 style={{ textAlign: 'center' }}>Option 2</h2> <EmailOfferOptions order={rootOrder} />
        </>
      )}
      <br />
      <p>
        Unser Kostenvoranschlag gilt bis zum {getPrintableDate(addDays(new Date(), 3).toDateString())}. <br />
        Im Anhang finden Sie den Auftrag. <strong>Wir bitten um Ihre Rückmeldung</strong> (Rückbestätigung per E-Mail
        ohne Unterschrift).
      </p>
    </>
  );
}
