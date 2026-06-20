import { describe, expect, test } from 'vitest';

const initInvoiceSubject = (rNumber: string | undefined) => `Rechnung zu Ihrem Umzug ${rNumber}`;

function initInvoiceHtml(customer: any) {
  const lines = [
    '',
    '',
    `vielen Dank, dass Sie unsere Leistungen in Anspruch genommen haben.`,
    `Im Anhang befindet sich Ihre Rechnung.`,
    ``,
  ];
  if (customer) {
    const { salutation, lastName, firstName, company } = customer;
    if (company && !lastName) {
      lines[0] = 'Sehr geehrte Damen und Herren,';
    } else if (['Frau', 'Herr'].includes(salutation)) {
      lines[0] = salutation === 'Frau' ? `Sehr geehrte Frau ${lastName},` : `Sehr geehrter Herr ${lastName},`;
    } else {
      lines[0] = `Hallo ${firstName} ${lastName},`;
    }
  }
  return `<p>${lines.join('<br/>')}</p>`;
}

describe('initInvoiceSubject', () => {
  test('with rNumber', () => {
    expect(initInvoiceSubject('R-2024-001')).toBe('Rechnung zu Ihrem Umzug R-2024-001');
  });

  test('with undefined', () => {
    expect(initInvoiceSubject(undefined)).toBe('Rechnung zu Ihrem Umzug undefined');
  });
});

describe('initInvoiceHtml', () => {
  test('with customer Frau', () => {
    const customer = { salutation: 'Frau', lastName: 'Müller', firstName: 'Anna' };
    const html = initInvoiceHtml(customer);
    expect(html).toContain('Sehr geehrte Frau Müller,');
    expect(html).toContain('Ihre Rechnung');
  });

  test('with customer Herr', () => {
    const customer = { salutation: 'Herr', lastName: 'Meier', firstName: 'Max' };
    const html = initInvoiceHtml(customer);
    expect(html).toContain('Sehr geehrter Herr Meier,');
  });

  test('with company only', () => {
    const customer = { company: 'Firma GmbH', firstName: 'Max', lastName: '' };
    const html = initInvoiceHtml(customer);
    expect(html).toContain('Sehr geehrte Damen und Herren,');
  });

  test('without customer', () => {
    const html = initInvoiceHtml(undefined);
    expect(html).toContain('Ihre Rechnung');
    expect(html).not.toContain('Sehr geehrt');
  });
});
