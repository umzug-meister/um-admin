import {
  euroValue,
  getAmountOfParkingSlots,
  getCustomerFullname,
  getCustomerStreet,
  getParseableDate,
  getPrintableDate,
} from './utils';

import { expect, test, describe } from 'vitest';

import { Order } from 'um-types';

describe('euroValue', () => {
  test('undefined', () => {
    expect(euroValue(undefined)).toBe('');
  });

  test('empty string', () => {
    expect(euroValue('')).toBe('');
  });

  test('integer', () => {
    expect(euroValue('12')).toBe('12,00\xa0€');
    expect(euroValue(1295)).toBe('1.295,00\xa0€');
  });

  test('float', () => {
    expect(euroValue('12,24')).toBe('12,24\xa0€');
    expect(euroValue(1295.99)).toBe('1.295,99\xa0€');
  });
});

describe('getPrintableDate', () => {
  test('undefined', () => {
    expect(getParseableDate(undefined)).toBe('');
  });

  test('print-format', () => {
    const pd = getPrintableDate('10.12.2022');
    expect(pd).equal('10.12.2022');
  });
  test('parseable-date', () => {
    const pd = getPrintableDate('2022-12-10');
    expect(pd).equal('10.12.2022');
  });

  test('parseable-date, long', () => {
    const pd = getPrintableDate('2022-12-10', true);
    expect(pd).equal('Samstag, 10. Dezember 2022');
  });
});

describe('getParseableDate', () => {
  test('undefined', () => {
    expect(getParseableDate(undefined)).toBe('');
  });
  test('print-format', () => {
    const pd = getParseableDate('10.12.2022');

    expect(pd).equal('2022-12-10');
  });
  test('already parseable', () => {
    expect(getParseableDate('2022-12-10')).toBe('2022-12-10');
  });
});

describe('getCustomerFullname', () => {
  test('null', () => {
    expect(getCustomerFullname(null)).toBe('');
  });

  test('customer full', () => {
    expect(
      getCustomerFullname({ customer: { firstName: 'Max', lastName: 'Meier', salutation: 'Herr' } } as Order),
    ).toBe('Herr Max Meier');
  });
});

describe('getCustomerStreet', () => {
  test('empty', () => {
    expect(getCustomerStreet(null)).toBe('');
    expect(getCustomerStreet({} as Order)).toBe('');
    expect(getCustomerStreet({ to: {} } as Order)).toBe('');
  });

  test('no comma', () => {
    expect(getCustomerStreet({ to: { address: 'Street 2' } } as Order)).toBe('Street 2');
  });

  test('has street', () => {
    expect(getCustomerStreet({ to: { address: 'Street 2, 80804 Muenchen' } } as Order)).toBe('Street 2');
  });

  test('has street, with country', () => {
    expect(getCustomerStreet({ to: { address: 'Street 2, 80804 Muenchen, Deutschland' } } as Order)).toBe('Street 2');
  });
});

describe('getMountOfParkingSlots', () => {
  test('both from and to have parking slots', () => {
    const order = { from: { parkingSlot: true }, to: { parkingSlot: true } } as Order;
    expect(getAmountOfParkingSlots(order)).toBe(2);
  });

  test('only from has parking slot', () => {
    const order = { from: { parkingSlot: true }, to: {} } as Order;
    expect(getAmountOfParkingSlots(order)).toBe(1);
  });

  test('only to has parking slot', () => {
    const order = { from: { parkingSlot: false }, to: { parkingSlot: true } } as Order;
    expect(getAmountOfParkingSlots(order)).toBe(1);
  });

  test('no parking slots', () => {
    const order = { from: {}, to: {} } as Order;
    expect(getAmountOfParkingSlots(order)).toBe(0);
  });
});

describe('getCustomerFullname', () => {
  test('customer with all fields', () => {
    expect(
      getCustomerFullname({
        customer: { salutation: 'Frau', firstName: 'Anna', lastName: 'Schmidt', company: 'ABC GmbH' },
      } as Order),
    ).toBe('Frau Anna Schmidt (ABC GmbH)');
  });

  test('customer without salutation', () => {
    expect(
      getCustomerFullname({ customer: { firstName: 'John', lastName: 'Doe', company: 'XYZ Inc.' } } as Order),
    ).toBe('John Doe (XYZ Inc.)');
  });

  test('customer without company', () => {
    expect(
      getCustomerFullname({ customer: { salutation: 'Mr.', firstName: 'James', lastName: 'Bond' } } as Order),
    ).toBe('Mr. James Bond');
  });

  test('customer with only first name', () => {
    expect(getCustomerFullname({ customer: { firstName: 'Madonna' } } as Order)).toBe('Madonna');
  });

  test('customer with only last name', () => {
    expect(getCustomerFullname({ customer: { lastName: 'Cher' } } as Order)).toBe('Cher');
  });

  test('customer with only company', () => {
    expect(getCustomerFullname({ customer: { company: 'Acme Corp' } } as Order)).toBe('(Acme Corp)');
  });

  test('customer with whitespace in names', () => {
    expect(
      getCustomerFullname({
        customer: { firstName: '  John  ', lastName: '  Doe  ', company: '  ABC Ltd.  ' },
      } as Order),
    ).toBe('John Doe (ABC Ltd.)');
  });

  test('empty customer object', () => {
    expect(getCustomerFullname({ customer: {} } as Order)).toBe('');
  });
});
