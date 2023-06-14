import { useLoadOrder } from '../hooks/useLoadOrder';
import { anrede, euroValue, getPrintableDate } from '../utils/utils';
import EMailTextTemplate from './EMailTextTemplate';

import { Address } from 'um-types';

export default function EMailText() {
  const order = useLoadOrder();

  if (order == null) {
    return null;
  }

  const persons = () => {
    const { workersNumber, transporterNumber, t75 } = order;

    let _persons = `${workersNumber} Träger/Ladehelfer`;

    if (transporterNumber || t75) {
      _persons += ` mit `;
    }
    if (transporterNumber) {
      _persons += `${transporterNumber} x LKW (à 3,5 t mit 20 m³ Ladevermögen) `;
    }
    if (t75) {
      _persons += `${t75} x LKW (à 7,5 t mit 37,5 m³ Ladevermögen) `;
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

      return ort.trim() || '';
    }
    return ' ';
  };

  const stunden = () => {
    const { timeBased, from, to } = order;
    let _stunden = '';
    if (timeBased?.hours) {
      _stunden += `Mind. Abnahme ${timeBased.hours} Stunden (Anfang in ${getOrtFromAdress(
        from,
      )}, Ende in ${getOrtFromAdress(to)}): ${euroValue(timeBased.basis)} inkl. MwSt.`;
    }
    return _stunden;
  };

  const line = (desc = '', price: string | number = '', red = false, bold = false) => {
    const color = red ? 'red' : 'black';
    return (
      `<tr style="color: ${color};">` +
      `<t${bold ? 'h' : 'd'} align="left">${desc}: </t${bold ? 'h' : 'd'}>` +
      `<th align="right">${euroValue(price)} inkl. MwSt.</th>` +
      `</tr>`
    );
  };

  const servicesHTML = () => {
    const { leistungen = [], timeBased, sum } = order;

    const ammountDesc = `Gesamtbetrag ${timeBased?.hours ? `(${timeBased.hours} Stunden)` : ''}`;

    const htmlString =
      leistungen
        .filter((l) => l.hidden !== true)
        .map((lst) => line(lst.desc, lst.sum, lst.red))
        .join('') + line(ammountDesc, sum, false, true);

    return htmlString;
  };

  return (
    <EMailTextTemplate
      date={getPrintableDate(order.date, true)}
      time={order.time}
      volume={order.volume}
      anrede={anrede(order.customer)}
      orderId={order.id || '---1'}
      hasMontage={order.from?.demontage || order.to?.montage}
      extra={extra()}
      persons={persons()}
      stunden={stunden()}
      servicesHTML={servicesHTML()}
    />
  );
}
