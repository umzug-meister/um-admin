import { OPTIONS } from '..';
import { AppOptions } from '../../src/app-types';
import { euroValue, getParseableDate, numberValue } from '../utils/utils';
import { agb } from './AgbTemplate';
import PdfBuilder from './PdfBuilder';
import { orderFileName } from './filename';
import { PRIMARY, SECONDARY, WHITE, addDate, addHeader } from './shared';

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

export function generateUrzPdf(p: Payload) {
  const { options, order, services } = p;

  const filename = orderFileName(order);

  const pdffactory = new PdfBuilder(filename, {
    left: 20,
    right: 12,
    top: 8,
    bottom: 3,
  });

  addHeader(pdffactory);
  addDate(pdffactory, new Date().toLocaleDateString('ru'));
  addTitle(pdffactory, order);

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

  addMoreInformation(pdffactory, order);

  addMoebel(pdffactory, order);
  addBoxes(pdffactory, order);
  addAGB(pdffactory, options);
  pdffactory.enumeratePages([`${order.id}`]);

  if (p.base64) {
    return pdffactory.output();
  }

  pdffactory.save();
}

const addSignature = (factory: PdfBuilder, sign: string): void => {
  factory.addText('___________________', 8, 6, 'right');
  factory.addText(sign, 8, 4, 'right');
  factory.resetText();
};

const addTitle = (factory: PdfBuilder, order: Order) => {
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
        'Name',
        `${order.customer?.salutation || ''} ${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`,
        'Tel.',
        `${order.customer?.telNumber}`,
      ],
    ],
    {
      0: { fontStyle: 'bold', cellWidth: CELL_WIDTH_0 },
      2: { fontStyle: 'bold' },
    },
  );

  const date = new Date(getParseableDate(order.date));

  const f = new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium' });

  //Umzugsdatum
  factory.addTable(
    null,
    [['Umzugstermin', `${f.format(date)} ${order.time || ''}`, 'Umzugsanfrage Nr.', `${order.rid || ''}`]],
    {
      0: { fontStyle: 'bold', cellWidth: CELL_WIDTH_0 },
      1: { cellWidth: CELL_WIDTH_1 },
      2: { fontStyle: 'bold' },
      3: {
        cellWidth: CELL_WIDTH_1,
      },
    },
  );

  //Volumen

  let mark = '';
  if (order.check24) {
    mark = 'CHECK 24';
  }
  if (order.myhammer) {
    mark = 'My Hammer';
  }
  factory.addTable(null, [['Volumen', `${order.volume || ''} m³`, 'Max. m³ Abweichung: 10%', mark]], {
    0: { fontStyle: 'bold', cellWidth: CELL_WIDTH_0 },
    1: { cellWidth: CELL_WIDTH_1 },
    2: { fontStyle: 'bold', textColor: SECONDARY },
    3: {
      fontStyle: 'bold',
      cellWidth: CELL_WIDTH_1,
    },
  });

  //message
  if (order.text) {
    factory.addTable(
      null,
      [['weitere Informationen auf Seite 3']],

      {
        0: { fontStyle: 'italic' },
      },
    );
  }
};

function combineString(arr: string[]) {
  const SEP = ' + ';
  return arr.filter((s) => s).join(SEP);
}

function addAdresses(factory: PdfBuilder, order: Order) {
  factory.addSpace();
  const { from, to } = order;

  const fromServices = [];
  const toServices = [];

  const fromFloors = [];
  const toFloors = [];

  //#region floors
  if (from.movementObject?.toLocaleLowerCase() === 'haus') {
    fromFloors.push(...(from.stockwerke || []));
  } else if (from?.floor) {
    fromFloors.push(from.floor);
  }

  if (to?.movementObject?.toLocaleLowerCase() === 'haus') {
    toFloors.push(...(to.stockwerke || []));
  } else if (to?.floor) {
    toFloors.push(to.floor);
  }

  if (from.hasLoft) {
    fromFloors.push('Dachboden');
  }
  if (from.hasBasement) {
    fromFloors.push('Keller');
  }

  if (from.hasGarage) {
    fromFloors.push('Garage');
  }

  if (to.hasLoft) {
    toFloors.push('Dachboden');
  }

  //#endregion

  //#region extras
  if (from?.demontage) {
    fromServices.push('Möbeldemontage');
  }
  if (from.packservice) {
    fromServices.push('Einpackservice');
  }

  if (to?.montage) {
    toServices.push('Möbelmontage');
  }
  if (to.packservice) {
    toServices.push('Auspackservice');
  }
  //#endregion

  const body = [
    ['Straße, Nr.', `${from?.address?.split(',')[0] || ''}`, `${to?.address?.split(',')[0] || ''}`],
    [
      'PLZ, Ort',
      `${from?.address?.split(',')?.[1]?.trimStart() || ''}`,
      `${to?.address?.split(',')?.[1]?.trimStart() || ''}`,
    ],
    ['Auszug/Einzug', `${from?.movementObject || ''}`, `${to?.movementObject || ''}`],
    ['Etage', combineString(fromFloors), combineString(toFloors)],
    [
      'Lift',
      `${from?.liftType || ''}${from?.isAltbau ? ', Altbau' : ''}`,

      `${to?.liftType || ''}${to?.isAltbau ? ', Altbau' : ''}`,
    ],
    ['Trageweg', `${from?.runningDistance || ''}`, `${to?.runningDistance || ''}`],
    [
      'Parkverbotszone',
      `${from?.parkingSlot ? 'Ja' : 'wird von Kund*innen sichergestellt'}`,
      `${to?.parkingSlot ? 'Ja' : 'wird von Kund*innen sichergestellt'}`,
    ],
  ];

  const servicesRow = [];

  if (fromServices.length > 0 || toServices.length > 0) {
    servicesRow.push(...['', combineString(fromServices), combineString(toServices)]);
  }

  if (servicesRow.length > 0) {
    body.push(servicesRow);
  }

  factory.addTable(
    [['', 'Beladestelle', 'Entladestelle']],
    body,
    {
      0: { cellWidth: CELL_WIDTH_1 },
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
          content: numberValue(l.colli),
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
        c: numberValue(l.colli),
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
    factory.setNormal();
    factory.addText(`Je angefangene weitere Stunde: ${euroValue(order.timeBased?.extra)} inkl. MwSt.`, 9, 6, 'right');
    factory.addText(
      'Bei einer Zeitüberschreitung von bis zu 20 min ist 1/2 Stunde zu bezahlen, ab 20 min wird eine volle Stunde berechnet.',
      9,
      6,
      'right',
    );
  } else {
    factory.addText(`Gesamt: ${euroValue(price)}`, 14, 10, 'right');
  }
  factory.setNormal();
};

const addTopPageTextSecondPage = (factory: PdfBuilder) => {
  const textBlocks = [
    'Die Anzahl der Ladehelfer und die Arbeitsdauer in Stunden werden basierend auf den ' +
      'von Auftraggeber*innen im Online-Formular "Umzugsanfrage/Umzugsgutliste"bereitgestellten Daten berechnet. ' +
      'Diese Daten umfassen den Trageweg, die Zimmeranzahl, das Stockwerk und das Umzugsgutvolumen (in Kubikmetern).',

    'Wenn kein Formular ausgefüllt wird, erfolgt die Berechnung gemäß der aktuellen Preisliste und Bestimmungen der AGB, insbesondere den §§ "Erweiterungen des Leistungsumfangs"',

    'Aufgrund der körperlichen Belastung sind pro Stunde 5 Minuten Pause vorgesehen. ' +
      'Die Pausenzeit ist bereits im Angebot berücksichtigt und wird nicht von der empfohlenen Gesamtdauer abgezogen.',

    'Wenn die Firma Umzug Ruck nicht ausreichend detaillierte schriftliche Informationen zum Umzug erhält, ' +
      'behält sich das Unternehmen das Recht vor, den Auftrag oder die Möbelliste um Positionen wie beispielsweise ' +
      '"Volumen in Kubikmetern", "Schwertransport", "Trageweg" oder "Transport von sperrigen Gegenständen" zu erweitern.',
  ];

  factory.resetText();

  textBlocks.forEach((block) => {
    factory.addTable(null, [[`• ${block}`]], { 0: { lineColor: [255, 255, 255] } });
  });
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

      return [s.name, euroValue(price), numberValue(colli), sum];
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

      return [s.name, euroValue(price), numberValue(colli), sum];
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

const addMoreInformation = (factory: PdfBuilder, order: Order) => {
  factory.addPage();
  if (order.text) {
    const header = [['Weitere Informationen']];
    const body = [[order.text]];

    factory.addTable(header, body);
  }
};

const addMoebel = (factory: PdfBuilder, order: Order) => {
  factory.addSpace();
  if (order.ownItems?.trim().length > 0) {
    factory.addTable([['Möbelliste']], [[order.ownItems]]);
  } else if (order.items?.length > 0) {
    const body = [];

    let actualroom = '';
    for (const curItem of order.items) {
      if (Number(curItem.colli) === 0) {
        continue;
      }
      if (curItem.selectedCategory && curItem.selectedCategory !== actualroom) {
        actualroom = curItem.selectedCategory || '';
        body.push({
          desc: {
            colSpan: 3,
            content: actualroom.toUpperCase(),

            styles: {
              fontStyle: 'bold',
              halign: 'left',
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
  factory.addPage({ top: 3, left: 8, right: 8, bottom: 3 });
  factory.setBold();
  factory.addText('Allgemeine Geschäftsbedingungen der Durchführung des Umzugs', 7);
  factory.resetText();

  addAgbText(factory, options);

  factory.addSpace(2);

  factory.setBold();
  factory.addText('Ich akzeptiere die allgemeinen Geschäftsbediengungen der Firma Umzug Ruckzuck', 8);
  factory.setNormal();
  addSignature(factory, 'Kundenunterschrift');
};

const addAgbText = (pdfBuilder: PdfBuilder, options: AppOptions) => {
  agb.forEach((paragraph, index) => {
    pdfBuilder.addTable(
      [[`§${index + 1} ${paragraph.title}`]],
      [[paragraph.text]],
      { 0: { fontSize: 7, lineColor: [255, 255, 255] } },
      { fontSize: 7, fillColor: [255, 255, 255], textColor: [0, 0, 0] },
      8,
    );

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

    if (paragraph.prices) {
      pdfBuilder.add2Cols(left, right, 7, 4, 1);
    }
  });
};
