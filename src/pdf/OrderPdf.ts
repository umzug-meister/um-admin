import { OPTIONS } from '..';
import { AppOptions } from '../../src/app-types';
import { euroValue } from '../utils/utils';
import Agb from './Agb';
import PdfBuilder from './PdfBuilder';
import { orderFileName } from './filename';

import { Order, OrderService, Service } from 'um-types';

interface Payload {
  order: Order;
  options: AppOptions;
  services: OrderService[];
  base64?: true;
}

const PRICE = 'Preis, inkl. MwSt';
const CELL_WIDTH_0 = 80;
const CELL_WIDTH_1 = 100;
const PRIMARY = [25, 120, 186];
const WHITE = [255, 255, 255];
const SECONDARY = [203, 43, 27];

export function generateUrzPdf(p: Payload) {
  const { options, order, services } = p;

  const filename = orderFileName(order);

  const pdffactory = new PdfBuilder(filename, {
    left: 20,
    right: 12,
    top: 8,
    bottom: 3,
  });

  addHeader(pdffactory, order);

  addAdresses(pdffactory, order);

  addConditionen(pdffactory, order);
  appendPrice(pdffactory, order);
  addPageTextFirstPage(pdffactory);
  addTopPageTextSecondPage(pdffactory);

  addServices(pdffactory, order, services, {
    titleColor: () => {
      pdffactory.setColor(SECONDARY[0], SECONDARY[1], SECONDARY[2]);
    },
    tableHeader: PRIMARY,
  });

  addVerpackung(pdffactory, order, services, {
    titleColor: () => {
      pdffactory.setColor(SECONDARY[0], SECONDARY[1], SECONDARY[2]);
    },
    tableHeader: PRIMARY,
  });

  addSecondPageEnd(pdffactory);

  addMoebel(pdffactory, order);
  addBoxes(pdffactory, order);
  addAGB(pdffactory, options);

  if (p.base64) {
    return pdffactory.output();
  }

  pdffactory.save();
}

const addTextMessage = (factory: PdfBuilder, text: string, label: string): void => {
  const head = [[label]];
  const body = [[text.replace(';;', '')]];
  factory.addTable(head, body);
  factory.addSpace(3);
};

const addSignature = (factory: PdfBuilder, sign: string): void => {
  factory.addText('___________________', 8, 6, 'right');
  factory.addText(sign, 8, 4, 'right');
  factory.resetText();
};

const addHeader = (factory: PdfBuilder, order: Order) => {
  const imageUrl = window.location.origin + process.env.PUBLIC_URL + '/ruckzuck_logo.png';

  factory.addPngImage(imageUrl, 20, 8, 30, 38);

  factory.setNormal();
  factory.setColor(60, 60, 60);

  factory.addLeftRight(
    [],
    [
      'Alexander Berent',
      'Am Münchfeld 31, 80999 München',
      '089 30642972 | 0176 10171990',
      'umzugruckzuck@gmail.com',
      '',
      '',
      'Steuernummer: 144/139/21180',
      '',
      '',
      `München, den ${new Date().toLocaleDateString('ru')}`,
    ],
    8,
  );

  factory.setBold();
  factory.addSpace(10);

  factory.addText(`ANGEBOT / AUFTRAG / ABRECHNUNG - Nr. ${order.id}`, 12, 12, 'center');
  factory.addSpace(5);

  //Firma
  if (order?.customer?.company) {
    factory.addTable(null, [['Firma', `${order.customer.company}`]], {
      0: { fontStyle: 'bold', cellWidth: CELL_WIDTH_0 },
    });
  }

  //Kundenname
  factory.addTable(
    null,
    [
      [
        'Name:',
        `${order.customer?.salutation || ''} ${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`,
        'Tel.:',
        `${order.customer?.telNumber}`,
      ],
    ],
    {
      0: { fontStyle: 'bold', cellWidth: CELL_WIDTH_0 },
      2: { fontStyle: 'bold' },
    },
  );

  //Umzugsdatum
  factory.addTable(
    null,
    [['Umzugstermin:', `${order.date || ''} ${order.time || ''}`, 'Umzugsanfrage Nr.:', `${order.rid || ''}`]],
    {
      0: { fontStyle: 'bold', cellWidth: CELL_WIDTH_0 },
      1: { cellWidth: CELL_WIDTH_1 },
      2: { fontStyle: 'bold' },
    },
  );

  //Volumen
  factory.addTable(null, [['Volumen:', `${order.volume || ''} m³`, 'Max. m³ Abweichung: 10%']], {
    0: { fontStyle: 'bold', cellWidth: CELL_WIDTH_0 },
    1: { cellWidth: CELL_WIDTH_1 },
    2: { fontStyle: 'bold', textColor: SECONDARY },
  });

  //message
  const _message = order.text?.replaceAll(';;', '');
  factory.addTable(
    null,
    [['Notiz:', _message]],

    {
      0: { fontStyle: 'bold', cellWidth: CELL_WIDTH_0 },
    },
  );
};

function yesNo(prop: boolean | undefined) {
  return prop ? 'Ja' : 'Nein';
}

function addAdresses(factory: PdfBuilder, order: Order) {
  factory.addSpace();
  const { from, to } = order;

  const demontage = from?.demontage;
  const montage = to?.montage;

  factory.addTable(
    [['BELADESTELLE', '', 'ENTLADESTELLE', '']],
    [
      ['Straße, Nr.', `${from?.address?.split(',')[0] || ''}`, 'Straße, Nr.', `${to?.address?.split(',')[0] || ''}`],
      [
        'PLZ und Ort',
        `${from?.address?.split(',')?.[1]?.trimStart() || ''}`,
        'PLZ und Ort',
        `${to?.address?.split(',')?.[1]?.trimStart() || ''}`,
      ],
      ['Auszug aus', `${from?.movementObject || ''}`, 'Einzug in', `${to?.movementObject || ''}`],
      ['Etage', `${from?.floor || ''}`, 'Etage', `${to?.floor || ''}`],
      [
        'Lift',
        `${from?.liftType || ''}${from?.isAltbau ? ', Altbau' : ''}`,
        'Lift',
        `${to?.liftType || ''}${to?.isAltbau ? ', Altbau' : ''}`,
      ],
      ['Trageweg', `${from?.runningDistance || ''}`, 'Trageweg', `${to?.runningDistance || ''}`],
      [
        'Parkverbotszone',
        `${from?.parkingSlot ? 'Ja' : 'wird von Kund*innen sichergestellt'}`,
        'Parkverbotszone',
        `${to?.parkingSlot ? 'Ja' : 'wird von Kund*innen sichergestellt'}`,
      ],
      ['Möbeldemontage', yesNo(demontage), 'Möbelmontage', yesNo(montage)],
      ['Einpackservice', yesNo(from?.packservice), 'Auspackservice', yesNo(to?.packservice)],
    ],
    {
      0: { cellWidth: CELL_WIDTH_0 },
      2: { cellWidth: CELL_WIDTH_0 },
    },
    {
      fillColor: PRIMARY,
      textColor: WHITE,
    },
  );
}

const addConditionen = (factory: PdfBuilder, order: Order) => {
  factory.addSpace();
  const head = [{ a: 'Konditionen', b: 'Einzelpreis', c: 'Menge', d: PRICE }];

  const body = (order.leistungen || []).map((l) => {
    if (l.red === true) {
      const styles = {
        fontStyle: 'bold',
        halign: 'left',
        textColor: SECONDARY,
      };
      return {
        a: {
          content: l.desc,
          styles,
        },
        b: {
          content: euroValue(l.price),
          styles,
        },
        c: {
          content: l.colli || '',
          styles,
        },
        d: {
          content: euroValue(l.sum),
          styles: { ...styles, halign: 'right' },
        },
      };
    } else {
      return {
        a: l.desc,
        b: euroValue(l.price),
        c: l.colli || '',
        d: euroValue(l.sum),
      };
    }
  });

  factory.addTable(
    head,
    body,
    {
      1: { cellWidth: CELL_WIDTH_0, halign: 'right' },
      2: { cellWidth: CELL_WIDTH_0, halign: 'right' },
      3: { cellWidth: CELL_WIDTH_0, halign: 'right' },
    },
    { fillColor: PRIMARY, textColor: WHITE },
  );
};

const appendPrice = (factory: PdfBuilder, order: Order) => {
  const BEST_Y_POS = 200;
  const currentY = factory.getY();
  if (currentY < BEST_Y_POS) {
    factory.addSpace(BEST_Y_POS - currentY);
  }
  factory.setColor(SECONDARY[0], SECONDARY[1], SECONDARY[2]);
  factory.setBold();
  factory.addText('Die Preise sind inklusive gesetzlicher Haftung in Höhe von 620,0 Euro / m³.', 8);
  factory.resetText();
  factory.setBold();
  addPrice(factory, order, false);
};

const addPageTextFirstPage = (factory: PdfBuilder) => {
  factory.resetText();
  factory.addText(
    'Zahlungsart: An unsere Mitarbeiter vor Ort nach dem Umzug in Bar oder per Überweisung\n(Zahlungseingang auf unser Konto spätestens 1 Tag vor dem Umzug).',
    9,
  );

  addSignature(factory, 'Kundenunterschrift');

  factory.addLine();
  factory.setBold();
  factory.addText('Empfänger: Alexander Berent  |  Stadtsparkasse München  |  IBAN: DE41 7015 0000 1005 7863 20', 9);
  factory.addLine();

  factory.addText(
    'Hiermit erteile(n) ich(wir) den Auftrag, den Umzug für o.g. abgestimmte Konditionen durchzuführen.',
    9,
  );

  addSignature(factory, 'Kundenunterschrift');
  factory.setColor(PRIMARY[0], PRIMARY[1], PRIMARY[2]);
  factory.addText('Bitte beachten Sie: Auflistung weiterer Leistungen befindet sich auf der nächsten Seite.', 9);
  factory.addPage();
};

const addPrice = (factory: PdfBuilder, order: Order, showTitel = true): void => {
  const MWST = 19;

  const isTime = Number(order.timeBased?.hours || 0) > 0;
  showTitel && factory.addHeader(`Preis`, 10);
  let price = Number(order.sum);
  let tax = (price / (100 + MWST)) * MWST;
  let netto = price - tax;
  factory.setBold();
  factory.addText(`Netto: ${euroValue(netto)}`, 9, 6, 'right');
  factory.addText(`MwSt. ${MWST}%: ${euroValue(tax)}`, 9, 6, 'right');
  factory.addLine(PdfBuilder.mm2pt(100));
  factory.setBold();

  if (isTime === true) {
    factory.addText(`Gesamtpreis für ${order.timeBased?.hours || ''} Stunden: ${euroValue(price)}`, 14, 10, 'right');

    factory.addText(`Je angefangene weitere Stunde: ${euroValue(order.timeBased?.extra)} inkl. MwSt.`, 9, 6, 'right');
  } else {
    factory.addText(`Gesamt: ${euroValue(price)}`, 14, 10, 'right');
  }
  factory.setNormal();
};

const addTopPageTextSecondPage = (factory: PdfBuilder) => {
  factory.resetText();
  factory.addText('• Der Möbelaufbau erfolgt nur, wenn der Abbau durch die Firma Umzug Ruck Zuck erfolgte.');
  factory.addText(
    `• Anzahl der Ladehelfer und Dauer der Arbeit (Stunden) berechnet sich anhand der, von dem/der Auftraggeber(in)
    zur Verfügung gestellten Daten aus dem Online Formular "Umzugsanfrage/Umzugsgutliste":
    Trageweg, Zimmeranzahl, Stockwerk und Umzugsgut (m³).`,
  );
  factory.addText(
    `• Wird kein Formular ausgefüllt, erfolgt die Berechnung anhand der folgenden Parameter und der
    AGB §16 "Erweiterungen des Leistungsumfangs".`,
  );
  factory.addText(
    `• Aufgrund der Schwere der Arbeit, sind pro Stunde 8 Min Pause zu gewähren. Die Pausenzeit ist bereits im Angebot
    einkalkuliert und wird von der vorgeschlagenen Zeit nicht abgezogen.`,
  );
  factory.addText(
    `•  Werden der Firma Umzug Ruck Details des Umzuges schriftlich nicht bekannt gegeben, behält sich
    das Unternehmen das Recht vor, den Auftrag, bzw. die Möbelliste um Positionen wie z.B. "Volumen m³",
    "Schwertransport","Trageweg" oder "Transport von sperrigen Gegenständen"  zu erweitern.`,
  );
};

function getColli(serv: Service, order: Order): string {
  const servId = serv.id;
  const orderServices = order.services || [];
  return orderServices.find((s) => Number(s.id) === Number(servId))?.colli || '';
}

function getPrice(serv: OrderService, order: Order): string {
  const servId = serv.id;
  const orderServices = order.services || [];
  return orderServices.find((s) => Number(s.id) === Number(servId))?.price || serv.price;
}

const addVerpackung = (
  factory: PdfBuilder,
  order: Order,
  serv: OrderService[],
  colors: { titleColor: Function; tableHeader: number[] },
) => {
  colors.titleColor();
  factory.setBold();
  factory.addText('Verpackung (wird nach Verbrauch berechnet)');

  const head = [['Artikel', 'Einzelpreis', 'Menge', PRICE]];

  const body = serv
    .filter((s) => s.tag === 'Packmaterial')
    .map((s) => {
      const colli = getColli(s, order);

      const price = getPrice(s, order);
      let sum = '';
      if (colli !== '') {
        sum = euroValue(Number(price) * Number(colli));
      }

      return [s.name, euroValue(price), colli, sum];
    });

  factory.addTable(
    head,
    body,
    {
      1: { cellWidth: CELL_WIDTH_0, halign: 'right' },
      2: { cellWidth: CELL_WIDTH_0, halign: 'right' },
      3: { cellWidth: CELL_WIDTH_0, halign: 'right' },
    },
    { fillColor: colors.tableHeader, textColor: WHITE },
  );
  factory.addSpace(3);
};

const addServices = (
  factory: PdfBuilder,
  order: Order,
  serv: OrderService[],
  colors: { titleColor: Function; tableHeader: number[] },
) => {
  colors.titleColor();
  factory.setBold();
  factory.addText('Leistungen');

  const head = [['Artikel', 'Einzelpreis', 'Menge', PRICE]];
  const body = (serv || [])
    .filter((s) => s.tag === 'Bohrarbeiten')
    .map((s) => {
      const colli = getColli(s, order);
      const price = getPrice(s, order);
      let sum = '';
      if (colli !== '') {
        sum = euroValue(Number(price) * Number(colli));
      }

      return [s.name, euroValue(price), colli, sum];
    });

  factory.addTable(
    head,
    body,
    {
      1: { cellWidth: CELL_WIDTH_0, halign: 'right' },
      2: { cellWidth: CELL_WIDTH_0, halign: 'right' },
      3: { cellWidth: CELL_WIDTH_0, halign: 'right' },
    },
    { fillColor: colors.tableHeader, textColor: WHITE },
  );
  factory.addSpace(3);
};

const addSecondPageEnd = (factory: PdfBuilder) => {
  factory.resetText();
  factory.addText('Nach der Besichtigung wurden Mängel festgestellt: [ ] keine   [ ] Wände   [ ] Möbel   [ ] Fußböden');

  factory.setBold();
  factory.addText('Auszugsadresse');
  factory.resetText();
  factory.setColor(PRIMARY[0], PRIMARY[1], PRIMARY[2]);
  factory.addText(
    '    Umzugsgut vollständig beladen:                                       (Kundenunterschrift) ___________________________',
  );
  factory.resetText();

  factory.setBold();
  factory.addText('Einzugsadresse');
  factory.resetText();
  factory.setColor(PRIMARY[0], PRIMARY[1], PRIMARY[2]);
  factory.addText(
    '    Auftrag vollständig und zufriedenstellend ausgeführt:      (Kundenunterschrift) ___________________________',
  );
  factory.resetText();

  factory.setBold();
  factory.addText(
    'Gesamtbetrag dankend erhalten:                          (Unterschrift des Fahrers) ___________________________',
  );
  factory.resetText();
};

const addMoebel = (factory: PdfBuilder, order: Order) => {
  if (order.ownItems?.trim().length > 0) {
    factory.addPage();
    addTextMessage(factory, order.ownItems, 'Möbelliste');
  } else if (order.items?.length > 0) {
    factory.addPage();

    const body = [];

    let actualroom = '';
    for (let i = 0; i < order.items.length; i++) {
      const curItem = order.items[i];
      if (Number(curItem.colli) === 0) {
        continue;
      }
      if (curItem.selectedCategory && curItem.selectedCategory !== actualroom) {
        actualroom = curItem.selectedCategory || '';
        body.push({
          desc: {
            colSpan: 3,
            content: actualroom,

            styles: {
              fontStyle: 'bold',
              halign: 'center',
              textColor: SECONDARY,
            },
          },
        });
      }
      const row: any = {};
      row.desc = curItem.name;
      row.colli = curItem.colli;
      row.weight = curItem.weight;
      body.push(row);
    }
    const header = [
      {
        desc: 'Bezeichnung',
        colli: 'Anzahl',
        weight: 'ggfs. Gewicht',
      },
    ];

    factory.addTable(header, body, undefined, {
      fillColor: PRIMARY,
      textColor: WHITE,
    });
  }
};

function addBoxes(pdffactory: PdfBuilder, order: Order) {
  if (order.boxNumber) {
    pdffactory.addSpace(5);
    pdffactory.setBold();
    pdffactory.addText(`Anzahl der Umzugskartons: ca. ${order.boxNumber}`, 9);
    pdffactory.setNormal();
  }
}

const addAGB = (factory: PdfBuilder, options: AppOptions): void => {
  const left = [
    `Bett Demontage oder Montage: ${euroValue(options[OPTIONS.A_MONTAGE_BET])}`,
    `Küche Demontage je 1 m.: ${euroValue(options[OPTIONS.A_KITCHEN_MONTAGE])}`,
    `Schrank Demontage oder Montage je 1 m.: ${euroValue(options[OPTIONS.A_WARDROBE_MONTAGE])}`,
    `Je zusätzliches m³ Ladevolumen: ${euroValue(options[OPTIONS.A_CBM])}`,
  ];
  const right = [
    `Je 10 Meter zusätzlichem Laufweg am Auzugsort oder Einzugsort: ${euroValue(options[OPTIONS.A_10_METER])}`,
    `1 Karton zusätzlich Einpacken oder Auspacken: ${euroValue(options[OPTIONS.A_KARTON_PACK])}`,
    `Jede zusätzliche Etage am Auzugsort oder Einzugsort: ${euroValue(options[OPTIONS.A_ETAGE])}`,

    `Entsorgung: ${euroValue(options.disposalCbmPrice)}/m³ zzgl. einmaliger Pauschale in Höhe von ${euroValue(
      options.disposalBasicPrice,
    )}`,
  ];
  factory.addPage({ top: 3, left: 8, right: 8, bottom: 3 });
  factory.setBold();
  factory.addText('Allgemeine Geschäftsbedingungen (AGB) der Durchführung des Umzugs', 7);
  factory.resetText();

  addAGBPart(factory, Agb.agb1);
  factory.add2Cols(left, right, 6.5, 4, 5);
  factory.addSpace(1);
  addAGBPart(factory, Agb.agb2);
  factory.addText('Ich akzeptiere die Allgemeinen Geschäftsbediengungen der Firma Umzug Ruckzuck', 7);
  addSignature(factory, 'Kundenunterschrift');
};

const addAGBPart = (factory: PdfBuilder, pars: string[]): void => {
  let bold = true;
  pars.forEach((text) => {
    if (bold) {
      factory.setBold();
      factory.addTextNoSpace(text, 6);
    } else {
      factory.setNormal();
      factory.addTextNoSpace(text, 7);
    }
    bold = !bold;
  });
};
