import { useCurrentOrder } from '../hooks/useCurrentOrder';
import { euroValue, getPrintableDate } from '../utils/utils';
import EMailTextTemplate from './EMailTextTemplate';

import { Address } from 'um-types';

export function EMailText() {
  const order = useCurrentOrder();

  if (order == null) {
    return null;
  }

  const anrede = () => {
    const {
      customer: { salutation, lastName, company },
    } = order;

    if (company && !lastName) {
      return 'Sehr geehrte Damen und Herren,';
    }

    return salutation === 'Frau' ? `Sehr geehrte Frau ${lastName},` : `Sehr geehrter Herr ${lastName},`;
  };
  const persons = () => {
    const { workersNumber, transporterNumber, t75 } = order;

    let _persons = `${workersNumber} Träger/Ladehelfer`;

    if (transporterNumber || t75) {
      _persons += ` mit `;
    }
    if (transporterNumber) {
      _persons += `${transporterNumber} LKWs (à 3,5 t mit 20 m³ Ladevermögen) `;
    }
    if (t75) {
      _persons += `${transporterNumber} LKWs (à 7,5 t mit 37,5 m³ Ladevermögen) `;
    }
    return _persons;
  };

  const extra = () => {
    const { timeBased } = order;
    if (timeBased?.extra) {
      return `Jede weitere Stunde: ${euroValue(timeBased.extra)} inkl. MwSt.`;
    } else {
      return '';
    }
  };

  const getOrtFromAdress = (orderAddress: Address) => {
    if (orderAddress) {
      const { address } = orderAddress;

      const ort = address?.split(', ')?.[1];

      return ort || '';
    }
    return ' ';
  };

  const stunden = () => {
    const { timeBased, from, to } = order;
    let _stunden = '';
    if (timeBased?.hours) {
      _stunden += `Mind. Abnahme ${timeBased.hours} Stunden (Anfang in ${getOrtFromAdress(
        from,
      )}, Ende in ${getOrtFromAdress(to)}) ${euroValue(timeBased.basis)} inkl. MwSt.`;
    }
    return _stunden;
  };

  const line = (name = '', price = '', red = false) => {
    const color = red ? 'red' : 'black';
    return (
      `<div style="display: flex; justify-content: space-between; color: ${color}>` +
      `<div>${name}</div>` +
      `<div>${euroValue(price)} inkl. MwSt.</div>` +
      `</div>`
    );
  };

  const servicesHTML = () => {
    const { leistungen, timeBased, sum } = order;

    const s = leistungen
      ?.filter((l) => l.hidden !== true)
      .map((lst) => line(lst.desc, lst.price, lst.red))
      .join(' ');

    let last = 'Gesamtbetrag';
    if (timeBased?.hours) {
      last += ` (${timeBased.hours} Stunden)`;
    }

    const priceString =
      `<div style="font-weight: bold; display: flex; justify-content: space-between>` +
      `<div>${last}</div>` +
      `<div>${euroValue(sum)} inkl. MwSt.</div>` +
      `</div>`;

    return s + priceString;
  };

  return (
    <EMailTextTemplate
      date={getPrintableDate(order.date, true)}
      time={order.time}
      volume={order.volume}
      anrede={anrede()}
      orderId={order.id || '---1'}
      hasMontage={order.from?.demontage || order.to?.montage}
      extra={extra()}
      persons={persons()}
      stunden={stunden()}
      servicesHTML={servicesHTML()}
    />
  );
}
