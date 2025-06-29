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

      <h3>👉 Wir freuen uns auf Ihre Rückmeldung</h3>
      <p>
        <strong>
          Unser Kostenvoranschlag ist bis zum {getPrintableDate(addDays(new Date(), 3).toDateString())} gültig.
        </strong>
        &nbsp;Im Anhang finden Sie den Auftrag.
      </p>
      <p>
        <strong>
          ❗️ Sollten Sie unser Angebot annehmen und die Durchführung des Umzugs beauftragen wollen, bitten wir Sie um
          eine kurze Bestätigung per E-Mail.
        </strong>
        &nbsp;Das Unterschreiben des Auftrages ist hierfür nicht erforderlich.
      </p>

      {rootOrder && <h2 style={{ color: '#333' }}>1. Option</h2>}
      <EmailOfferOptions order={order} />
      {rootOrder && (
        <>
          <br />
          <h2 style={{ color: '#333' }}>2. Option</h2> <EmailOfferOptions order={rootOrder} />
        </>
      )}
      <h3>Alle unseren Kostenvoranschläge beinhalten</h3>
      <Dotted>Anfahrt / Lastfahrtkosten</Dotted>
      {hasMontage && <Dotted>Möbelabbau und Aufbau</Dotted>}
      <Dotted>Bereitstellung eines Umzugswagens</Dotted>
      <Dotted>Versicherung: bis 2 Mio. Euro</Dotted>
      <Dotted>Be- und Entladen des LKWs</Dotted>
      <Dotted>Spanngurte, Dieselkosten sowie ausreichend Schutzdecken</Dotted>
      <Dotted>Ordentliche Rechnungsstellung</Dotted>
    </>
  );
}
