import { euroValue } from '../utils/utils';
import { addCustomer, addKonto, addPostAddr, addText, move } from './InvoicePdf';
import PdfBuilder from './PdfBuilder';
import { paymentReminderFileName } from './filename';
import { addDate, addHeader } from './shared';

import { eachDayOfInterval } from 'date-fns';
import { DueDate, Rechnung } from 'um-types';

interface PaymentReminderPayload {
  rechnung: Rechnung;
  index: number;
}

export const generatePaymentReminder = ({ index, rechnung }: PaymentReminderPayload) => {
  const factory = new PdfBuilder(paymentReminderFileName(rechnung, index), {
    left: 20,
    right: 12,
    top: 8,
    bottom: 3,
  });

  factory.addSpace(5);
  addHeader(factory);
  addPostAddr(factory);
  addDate(factory, new Date().toLocaleDateString('ru'));
  addCustomer(factory, rechnung);

  factory.addSpace(10);
  factory.addHeader(`${index}. Mahnung`, 14, 'center');
  const currentDueDate = rechnung.dueDates.find((dd) => dd.index === index);
  const lastDueDate = rechnung.dueDates.find((dd) => dd.index === index - 1);
  if (currentDueDate && lastDueDate) {
    addText(factory, currentDueDate?.text);

    addInvoiceInfo(factory, rechnung);
    addPaymentInfo(factory, currentDueDate, lastDueDate);
    addNumber(factory, currentDueDate?.sum, currentDueDate?.costs);
    move(factory, 260);
    addKonto(factory);
    factory.save();
  }
};

const getSum = (rechnung: Rechnung) => {
  return rechnung.entries
    .map((e) => Number(e.sum || '0'))
    .reduce((p, c) => {
      return p + c;
    }, 0);
};

function addPaymentInfo(factory: PdfBuilder, dueDate?: DueDate, lastDueDate?: DueDate) {
  if (dueDate && lastDueDate) {
    factory.addSpace(5);

    const interval = { start: parseDateString(lastDueDate.date), end: parseDateString(dueDate.date) };

    const verzug = eachDayOfInterval(interval).length;

    const head = [['Offener Betrag', 'Fälligkeit', 'Verzug']];
    const body = [[euroValue(dueDate.sum), lastDueDate?.date, `${verzug} Tage`]];

    const style = { halign: 'center' };
    const bodyStyle = { ...style, textColor: '#ff0000' };
    factory.addTable(
      head,
      body,
      {
        0: bodyStyle,
        1: bodyStyle,
        2: bodyStyle,
      },
      style,
    );
  }
}

function addInvoiceInfo(factory: PdfBuilder, rechnung: Rechnung) {
  factory.addSpace(5);
  const head = [['Rechnung Nr.', 'vom', 'Betrag']];
  const body = [[rechnung.rNumber, rechnung.date, euroValue(getSum(rechnung))]];
  factory.addTable(
    head,
    body,
    {
      0: { halign: 'center' },
      1: { halign: 'center' },
      2: { halign: 'center' },
    },
    { halign: 'center' },
    20,
  );
}

function addNumber(factory: PdfBuilder, sum = 0, costs = 0) {
  factory.addSpace(5);

  factory.add2Cols(
    ['Mahngebühr:', 'Summe fälliger Posten:'],
    [euroValue(costs), euroValue(Number(sum) + Number(costs))],
  );
}

function parseDateString(dString: string) {
  return new Date(dString.split('.').reverse().join('-'));
}
