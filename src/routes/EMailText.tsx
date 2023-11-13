import { Box } from '@mui/material';

import { useId } from 'react';

import { CopyOfferButton } from '../components/CopyOfferButton';
import EMailTextTemplate from '../components/EMailTextTemplate';
import { useLoadOrder } from '../hooks/useLoadOrder';
import { anrede, euroValue, getPrintableDate } from '../utils/utils';

import { Address } from 'um-types';

export default function EMailText() {
  const order = useLoadOrder();

  const elementID = useId();

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

      const ort = address?.split(', ')?.[1] || address;

      return ort?.trim() || '';
    }
    return ' ';
  };

  const stunden = () => {
    const { timeBased, from, to } = order;
    let line = '';
    if (timeBased?.hours) {
      line += `Mind. Abnahme ${timeBased.hours} Stunden`;
      const startLocation = getOrtFromAdress(from);
      const endLocation = getOrtFromAdress(to);
      if (startLocation && endLocation) {
        line += ` (Anfang in ${getOrtFromAdress(from)}, Ende in ${getOrtFromAdress(to)})`;
      }
      line += ': ';
    }
    line += `${euroValue(timeBased.basis)} inkl. MwSt.`;

    return line;
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

  const f = new Intl.NumberFormat('de-DE');

  return (
    <Box p={1}>
      <CopyOfferButton elementID={elementID} />
      <EMailTextTemplate
        elementID={elementID}
        date={getPrintableDate(order.date, true)}
        time={order.time}
        volume={f.format(Number(order.volume))}
        anrede={anrede(order.customer)}
        orderId={order.id || '---1'}
        hasMontage={order.from?.demontage || order.to?.montage}
        extra={extra()}
        persons={persons()}
        stunden={stunden()}
        servicesHTML={servicesHTML()}
      />
    </Box>
  );
}
