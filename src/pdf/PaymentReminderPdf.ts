import { euroValue } from '../utils/utils';
import { addCustomer, addKonto, addPostAddr, addText, move } from './InvoicePdf';
import PdfBuilder from './PdfBuilder';
import { paymentReminderFileName } from './filename';
import { addDate, addHeader } from './shared';

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
  addText(factory, generateText(rechnung, index));

  const currentDueDate = rechnung.dueDates.find((dd) => dd.index === index);
  const lastDueDate = rechnung.dueDates.find((dd) => dd.index === index - 1);
  addInvoiceInfo(factory, rechnung);
  addPaymentInfo(factory, currentDueDate, lastDueDate);
  addNumber(factory, currentDueDate?.sum, currentDueDate?.costs);

  move(factory, 260);
  addKonto(factory);
  factory.save();
};

const getDueDateSum = (index: number, rechnung: Rechnung) => {
  return rechnung.dueDates.find((dd) => dd.index === index)?.sum;
};

const getSum = (rechnung: Rechnung) => {
  return rechnung.entries
    .map((e) => Number(e.sum || '0'))
    .reduce((p, c) => {
      return p + c;
    }, 0);
};

const f_getDateByIndex = (dueDates: DueDate[]) => {
  return function getDateByIndex(index: number) {
    const dd = dueDates.find((dd) => dd.index === index);
    if (dd) {
      return dd.date;
    }
    return '';
  };
};

const generateText = (rechnung: Rechnung, index: number): string => {
  const sum = getDueDateSum(index, rechnung);

  const getDateByIndex = f_getDateByIndex(rechnung.dueDates);

  let result = 'Sehr ';
  if (rechnung.firma?.length > 0) {
    result = result.concat('geehrte Damen und Herren');
  } else if (rechnung.customerName.startsWith('Frau')) {
    result = result.concat(`geehrte ${rechnung.customerName}`);
  } else {
    result = result.concat(`geehrter ${rechnung.customerName}`);
  }
  result = result.concat(',\n\n');

  switch (index) {
    case 1:
      result = result.concat(
        `gewiss ist es Ihnen entgangen, dass ein Betrag in Höhe von ${euroValue(sum)}  bereits am ${getDateByIndex(
          0,
        )} fällig war. ` +
          `Zur Vermeidung der Erhebung von Verzugszinsen bitten wir Sie, Ihre Zahlung bis zum ${getDateByIndex(
            1,
          )} vozunehmen.` +
          `\n\nSollten Sie den Ausgleich bereits veranlasst haben, sehen Sie dieses Schreiben bitte als gegenstandlos an.` +
          `\n\nMit freundlichen Grüßen\nAlexander Berent`,
      );
      break;
    case 2:
      result = result.concat(
        `auf unsere Mahnung vom ${getDateByIndex(1)} haben Sie leider nicht reagiert. ` +
          `Bitte überweisen Sie den fälligen Betrag bis zum ${getDateByIndex(2)}.` +
          `\n\nFalls Sie diesen Zahlungstermin nicht einhalten, werden wir Ihnen Kosten des Mahnverfahrens und Verzugszinsen in Rechnung stellen müssen. ` +
          `\n\nSofern Sie zwischenzeitlich die Zahlung veranlasst haben, bitten wir Sie, dieses Schreiben als gegenstandslos zu betrachten.` +
          `\n\nMit freundlichen Grüßen\nAlexander Berent`,
      );
      break;
    default:
    case 3:
      result = result.concat(
        `auf unsere Mahnung vom ${getDateByIndex(1)} und 2. Mahnung vom ${getDateByIndex(
          2,
        )}. haben Sie nicht reagiert. ` +
          `Bitte überweisen Sie den fälligen Betrag bis spätestens ${getDateByIndex(3)}. ` +
          `Falls die letzte Zahlungsfrist ohne Eingang des Betrages auf unser Konto verstreicht, sehen wir uns gezwungen, gerichtliche Schritte gegen Sie einleiten zu müssen. ` +
          `Die Kosten des gesamten Verfahrens gehen zu Ihren Lasten.` +
          `\n\nSofern Sie zwischenzeitlich die Zahlung veranlasst haben, bitten wir Sie, dieses Schreiben als gegenstandslos zu betrachten.` +
          `\n\nMit freundlichen Grüßen\nAlexander Berent`,
      );
      break;
  }

  return result;
};

function addPaymentInfo(factory: PdfBuilder, dueDate?: DueDate, lastDueDate?: DueDate) {
  factory.addSpace(5);

  if (!dueDate) {
    return;
  }

  const verzug = daysBetween(parseDateString(dueDate.date), new Date());

  const head = [['Offener Betrag', 'Fälligkeit', 'Verzug']];
  const body = [[euroValue(dueDate.sum), lastDueDate?.date, verzug]];

  factory.addTable(
    head,
    body,
    {
      0: { halign: 'center' },
      1: { halign: 'center' },
    },
    { halign: 'center' },
  );
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

function daysBetween(d1: Date, d2: Date) {
  const Difference_In_Time = d2.getTime() - d1.getTime();

  return Math.floor(Difference_In_Time / (1000 * 3600 * 24));
}

function parseDateString(dString: string) {
  return new Date(dString.split('.').reverse().join('-'));
}
