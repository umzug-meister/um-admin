import { Address, Customer, DueDate, MLeistung, Order, OrderSrcType, Rechnung } from '@umzug-meister/um-core';
import { addDays } from 'date-fns';

const MWST = 1.19;

const WAITING_DAYS = 10;

const DEFAULT_REMINDER_COSTS = 10;

export const calculateNumbers = (entries: MLeistung[] = []) => {
  const brutto = entries.reduce((acc, elem) => {
    return acc + Number(elem.sum || 0);
  }, 0);

  const netto = brutto / MWST;

  const tax = brutto - netto;

  return {
    brutto,
    netto,
    tax,
  };
};

interface CreateDueDateParam {
  index: number;
  text: string;
  date: string;
  sum: number;
}

export const createDueDate = (payload: CreateDueDateParam): DueDate => {
  const { date, index, sum, text } = payload;

  return {
    text,
    index,
    costs: DEFAULT_REMINDER_COSTS,
    date,
    sum,
  };
};

interface GetNextDueDateParam {
  date?: Date;
}

export function getNextDueDate({ date = new Date() }: GetNextDueDateParam) {
  return addDays(date, WAITING_DAYS).toLocaleDateString('ru');
}

const PRINT_DATE_REGEX = /\d{2}.\d{2}.\d{4}/gm;
const PARSEABLE_DATE_REGEX = /\d{4}-\d{2}-\d{2}/gm;

export function getPrintableDate(date: string | undefined, long = false) {
  if (!date || date === '') {
    return '';
  }

  const isPrintable = PRINT_DATE_REGEX.test(date);

  if (isPrintable && !long) return date;

  if (long) {
    return new Intl.DateTimeFormat('de-DE', {
      dateStyle: 'full',
    }).format(new Date(getParseableDate(date)));
  }
  return new Date(date).toLocaleDateString('ru');
}

export function getParseableDate(date: any) {
  if (typeof date !== 'string') {
    return '';
  }

  const parseable = PARSEABLE_DATE_REGEX.test(date);
  if (parseable) {
    return date;
  }

  return date
    .split('.')
    .map((s) => s.padStart(2, '0'))
    .reverse()
    .join('-');
}

export function getCustomerFullname(order?: Order | null) {
  if (!order?.customer) {
    return '';
  }
  const arr = [];
  const { company, firstName, lastName, salutation } = order.customer;

  if (salutation) {
    arr.push(salutation);
  }
  if (firstName) {
    arr.push(firstName.trim());
  }
  if (lastName) {
    arr.push(lastName.trim());
  }
  if (company) {
    arr.push(`(${company.trim()})`);
  }

  return arr.join(' ');
}

export function getCustomerStreet(order?: Order | null) {
  if (order?.to) {
    return order.to.address?.split(', ')[0] || '';
  }
  return '';
}

export function getCustomerPLZ(order?: Order | null) {
  if (order?.to) {
    return order.to.address?.split(', ')[1];
  }
  return '';
}

export function euroValue(value: string | number | undefined) {
  if (typeof value == 'undefined' || value === '') {
    return '';
  }

  let toFormat = value;
  if (typeof value == 'string') {
    toFormat = value.replace(',', '.');
  }

  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(Number(toFormat));
}

export function numberValue(value: string | number | undefined) {
  if (typeof value == 'undefined' || value === '') {
    return '';
  }
  let toFormat = value;
  if (typeof value === 'string') {
    toFormat = value.replace(',', '.');
  }

  return new Intl.NumberFormat('de-DE').format(Number(toFormat));
}

export const anrede = (customer: Customer) => {
  const { salutation, lastName, firstName, company } = customer;

  if (company && !lastName) {
    return 'Sehr geehrte Damen und Herren,';
  }

  if (['Frau', 'Herr'].includes(salutation)) {
    return salutation === 'Frau' ? `Sehr geehrte Frau ${lastName},` : `Sehr geehrter Herr ${lastName},`;
  }
  return `Hallo ${firstName} ${lastName},`;
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

interface GenerateReminderTextParam {
  rechnung: Rechnung;
  index: number;
  sum: number;
  nextDueDate: string;
}
export const generateText = ({ nextDueDate, sum, index, rechnung }: GenerateReminderTextParam): string => {
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
          `Zur Vermeidung der Erhebung von Verzugszinsen bitten wir Sie, Ihre Zahlung bis zum ${nextDueDate} vorzunehmen.` +
          `\n\nSollten Sie den Ausgleich bereits veranlasst haben, sehen Sie dieses Schreiben bitte als gegenstandlos an.` +
          `\n\nMit freundlichen Grüßen\nAlexander Berent`,
      );
      break;
    case 2:
      result = result.concat(
        `auf unsere Mahnung vom ${getDateByIndex(1)} haben Sie leider nicht reagiert. ` +
          `Bitte überweisen Sie den fälligen Betrag bis zum ${nextDueDate}.` +
          `\n\nFalls Sie diesen Zahlungstermin nicht einhalten, werden wir Ihnen Kosten des Mahnverfahrens und Verzugszinsen in Rechnung stellen müssen. ` +
          `\n\nSofern Sie zwischenzeitlich die Zahlung veranlasst haben, bitten wir Sie, dieses Schreiben als gegenstandslos zu betrachten.` +
          `\n\nMit freundlichen Grüßen\nAlexander Berent`,
      );
      break;
    default:
      result = result.concat(
        `auf unsere Mahnung vom ${getDateByIndex(1)} und 2. Mahnung vom ${getDateByIndex(
          2,
        )}. haben Sie nicht reagiert. ` +
          `Bitte überweisen Sie den fälligen Betrag bis spätestens ${nextDueDate}. ` +
          `Falls die letzte Zahlungsfrist ohne Eingang des Betrages auf unser Konto verstreicht, sehen wir uns gezwungen, gerichtliche Schritte gegen Sie einleiten zu müssen. ` +
          `Die Kosten des gesamten Verfahrens gehen zu Ihren Lasten.` +
          `\n\nSofern Sie zwischenzeitlich die Zahlung veranlasst haben, bitten wir Sie, dieses Schreiben als gegenstandslos zu betrachten.` +
          `\n\nMit freundlichen Grüßen\nAlexander Berent`,
      );
      break;
  }

  return result;
};

export const getOrtFromAdress = (orderAddress: Address) => {
  if (orderAddress) {
    const { address } = orderAddress;

    const ort = address?.split(', ')?.[1] || address;

    return ort?.trim() || '';
  }
  return ' ';
};

export function getColorBySrc(src: OrderSrcType) {
  switch (src) {
    case 'check24':
      return '#0271c2';

    case 'obi':
      return '#ff7e21';

    case 'moebeltransport24':
      return '#f40009';

    case 'myhammer':
      return '#5e257a';

    case 'express':
      return '#addfcb';
    case 'individuelle':
      return '#70c8a4';
    case 'Moebelliste':
      return '#33b07d';
    case 'UmzugRuckZuck':
      return '#247b58';
  }
}

export function isLocalMovement(addresses: Array<Address | undefined>) {
  return addresses.filter((a) => typeof a !== 'undefined').every((address) => address.address?.includes('München'));
}

export function getParkingsSlotsAmount(addresses: Array<Address | undefined>) {
  return addresses.reduce((acc, address) => {
    if (address?.parkingSlot) {
      return acc + Number(address.parkingSlot);
    }
    return acc;
  }, 0);
}
