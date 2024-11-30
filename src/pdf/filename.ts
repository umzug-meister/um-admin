import { getPrintableDate } from '../utils/utils';

import { Gutschrift, Order, Rechnung } from 'um-types';

export const orderFileName = (order: Order) => {
  let filename = `${getPrintableDate(order.date)}_${order.customer?.lastName || 'Auftrag'}_${order.id}`;

  if (order.workersNumber) {
    filename = filename.concat('_').concat(order.workersNumber?.toString());
  }
  if (order.transporterNumber) {
    filename = filename.concat('+').concat(order.transporterNumber?.toString()).concat('x3.5');
  }

  if (order.timeBased?.hours) {
    filename = filename.concat('_').concat(order.timeBased?.hours?.toString()).concat('_Std');
  }
  let nmb = 0;
  if (order.from?.parkingSlot) {
    nmb++;
  }
  if (order.to?.parkingSlot) {
    nmb++;
  }
  if (nmb > 0) {
    filename = filename.concat('_').concat(nmb.toString()).concat('xHVZ');
  }

  return filename.concat('.pdf');
};

export const invoiceFileName = (rechnung: Rechnung) => {
  let name = rechnung.firma || rechnung.customerName || '';

  name = name.replace('Herr ', '').replace('Frau ', '');
  return `R-${rechnung.rNumber} ${name}.pdf`;
};

export const paymentReminderFileName = (rechnung: Rechnung, index: number) => {
  let name = rechnung.firma || rechnung.customerName;
  name = name.replace('Herr', '').replace('Frau', '');

  return `Mahnung Nr.${index} ${rechnung.rNumber} ${name}.pdf`;
};

export const creditFileName = (rechnung: Rechnung, gutschrift: Gutschrift) => {
  let name = rechnung.firma || rechnung.customerName;

  name = name.replace('Herr ', '').replace('Frau ', '');
  return `G-${gutschrift.gNumber} ${name}.pdf`;
};
