import { OPTIONS } from '..';
import { AppOptions } from '../../src/app-types';
import { euroValue, getParseableDate, numberValue } from '../utils/utils';
import { agb } from './AgbTemplate';
import { orderFileName } from './filename';
import PdfBuilder from './PdfBuilder';
import { addDate, addHeader, PRIMARY, SECONDARY } from './shared';

import { CustomItem, Order, OrderService, Service } from 'um-types';

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

  const pdfBuilder = new PdfBuilder(filename, {
    left: 20,
    right: 12,
    top: 8,
    bottom: 3,
  });

  addHeader(pdfBuilder);
  addDate(pdfBuilder, new Date().toLocaleDateString('ru'));
  addTitle(pdfBuilder, order);

  addAdresses(pdfBuilder, order);

  addConditionen(pdfBuilder, order);
  appendPrice(pdfBuilder, order);

  addPageTextFirstPage(pdfBuilder);
  addTopPageTextSecondPage(pdfBuilder);

  addServices(pdfBuilder, order, services);

  addVerpackung(pdfBuilder, order, services);

  addSecondPageEnd(pdfBuilder);

  addMoreInformation(pdfBuilder, order);
  addMontageList(pdfBuilder, order);
  addAntik(pdfBuilder, order);
  addHeavy(pdfBuilder, order);
  addBulky(pdfBuilder, order);
  addMoebel(pdfBuilder, order);
  addBoxes(pdfBuilder, order);
  addAGB(pdfBuilder, options);
  pdfBuilder.enumeratePages([`${order.id}`]);

  if (p.base64) {
    return pdfBuilder.output();
  }

  pdfBuilder.save();
}

const addAntik = (pdfBuilder: PdfBuilder, order: Order) => {
  if (order.expensive) {
    pdfBuilder.addBlackHeader('Antike & Wertvolle');

    addCustomItemsTable(pdfBuilder, order.expensiveItems);
  }
};
const addHeavy = (pdfBuilder: PdfBuilder, order: Order) => {
  if (order.heavy) {
    pdfBuilder.addBlackHeader('Besonders Schwere');

    addCustomItemsTable(pdfBuilder, order.heavyItems);
  }
};
const addBulky = (pdfBuilder: PdfBuilder, order: Order) => {
  if (order.bulky) {
    pdfBuilder.addBlackHeader('Sperrige');

    addCustomItemsTable(pdfBuilder, order.bulkyItems);
  }
};

const addCustomItemsTable = (pdfBuilder: PdfBuilder, customItems?: CustomItem[]) => {
  if (customItems?.length) {
    const head = [['Name', 'Anzahl', 'Breite (cm)', 'Tiefe (cm)', 'Höhe (cm)', 'Gewicht (kg)', 'Volumen (m³)']];
    const body = customItems.map((ci) => [
      ci.name,
      ci.colli,
      ci.breite,
      ci.tiefe,
      ci.hoehe,
      ci.weight,
      numberValue(ci.itemVolume),
    ]);

    pdfBuilder.addTable({ head, body });
  }
};

const addSignature = (pdfBuilder: PdfBuilder, sign: string): void => {
  pdfBuilder.addText('___________________', 8, 6, 'right');
  pdfBuilder.addText(sign, 8, 4, 'right');
  pdfBuilder.resetText();
};

const addTitle = (pdfBuilder: PdfBuilder, order: Order) => {
  pdfBuilder.setBold();
  pdfBuilder.addSpace(10);

  pdfBuilder.addText(`ANGEBOT / AUFTRAG / ABRECHNUNG - Nr. ${order.id}`, 12, 12, 'center');
  pdfBuilder.addSpace(5);

  //Firma
  if (order?.customer?.company) {
    pdfBuilder.addTable({
      head: null,
      body: [['Firma', `${order.customer.company}`]],
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: CELL_WIDTH_0 },
      },
    });
  }

  //Kundenname
  pdfBuilder.addTable({
    head: null,
    body: [
      [
        'Name',
        `${order.customer?.salutation || ''} ${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`,
        'Tel.',
        `${order.customer?.telNumber}`,
      ],
    ],
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: CELL_WIDTH_0 },
      2: { fontStyle: 'bold' },
    },
  });

  const date = new Date(getParseableDate(order.date));

  const f = new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium' });

  //Umzugsdatum
  pdfBuilder.addTable({
    head: null,
    body: [['Umzugstermin', `${f.format(date)} ${order.time || ''}`, 'Umzugsanfrage Nr.', `${order.rid || ''}`]],
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: CELL_WIDTH_0 },
      1: { cellWidth: CELL_WIDTH_1 },
      2: { fontStyle: 'bold' },
      3: {
        cellWidth: CELL_WIDTH_1,
      },
    },
  });

  //Volumen

  let mark = '';
  if (order.check24) {
    mark = 'CHECK 24';
  }
  if (order.myhammer) {
    mark = 'My Hammer';
  }
  pdfBuilder.addTable({
    head: null,
    body: [['Volumen', `${numberValue(order.volume)} m³`, 'Max. m³ Abweichung: 10%', mark]],
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: CELL_WIDTH_0 },
      1: { cellWidth: CELL_WIDTH_1 },
      2: { fontStyle: 'bold', textColor: SECONDARY },
      3: {
        fontStyle: 'bold',
        cellWidth: CELL_WIDTH_1,
      },
    },
  });

  //message
  if (order.text) {
    pdfBuilder.addTable({
      head: null,
      body: [['weitere Informationen auf Seite 3']],
    });
  }
};

function combineString(arr: string[]) {
  const SEP = ' + ';
  return arr.filter((s) => s).join(SEP);
}

function addAdresses(pdfBuilder: PdfBuilder, order: Order) {
  pdfBuilder.addSpace();
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

  pdfBuilder.addTable({
    head: [['', 'Beladestelle', 'Entladestelle']],
    body,
  });
}

const addConditionen = (pdfBuilder: PdfBuilder, order: Order) => {
  pdfBuilder.addSpace();
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

  pdfBuilder.addTable({
    head,
    body,
    columnStyles: {
      1: { cellWidth: CELL_WIDTH_0, halign: 'right' },
      2: { cellWidth: CELL_WIDTH_0, halign: 'right' },
      3: { cellWidth: CELL_WIDTH_0, halign: 'right' },
    },
  });
};

const appendPrice = (pdfBuilder: PdfBuilder, order: Order) => {
  const BEST_Y_POS = 200;
  const currentY = pdfBuilder.getY();

  if (currentY < BEST_Y_POS) {
    pdfBuilder.addSpace(BEST_Y_POS - currentY);
  }

  pdfBuilder.setColor(SECONDARY[0], SECONDARY[1], SECONDARY[2]);
  pdfBuilder.setBold();
  pdfBuilder.addText('Die Preise sind inklusive gesetzlicher Haftung in Höhe von 620,0 Euro / m³.', 8);
  pdfBuilder.resetText();
  pdfBuilder.setBold();
  addPrice(pdfBuilder, order, false);
};

const addPageTextFirstPage = (pdfBuilder: PdfBuilder) => {
  pdfBuilder.resetText();
  pdfBuilder.addText(
    'Zahlungsart: An unsere Mitarbeiter vor Ort nach dem Umzug in Bar oder per Überweisung\n(Zahlungseingang auf unser Konto spätestens 1 Tag vor dem Umzug).',
    9,
  );

  addSignature(pdfBuilder, 'Kundenunterschrift');

  pdfBuilder.addLine();
  pdfBuilder.setBold();
  pdfBuilder.addText('Empfänger: Alexander Berent  |  Stadtsparkasse München  |  IBAN: DE41 7015 0000 1005 7863 20', 9);
  pdfBuilder.addLine();

  pdfBuilder.addText(
    'Hiermit erteile(n) ich(wir) den Auftrag, den Umzug für o.g. abgestimmte Konditionen durchzuführen.',
    9,
  );

  addSignature(pdfBuilder, 'Kundenunterschrift');

  pdfBuilder.setColor(PRIMARY[0], PRIMARY[1], PRIMARY[2]);
  pdfBuilder.addText('Bitte beachten Sie: Auflistung weiterer Leistungen befindet sich auf der nächsten Seite.', 9);
  pdfBuilder.addPage();
};

const addPrice = (pdfBuilder: PdfBuilder, order: Order, showTitel = true): void => {
  const MWST = 19;

  const isTime = Number(order.timeBased?.hours || 0) > 0;
  showTitel && pdfBuilder.addHeader(`Preis`, 10);
  let price = Number(order.sum);
  let tax = (price / (100 + MWST)) * MWST;
  let netto = price - tax;
  pdfBuilder.setBold();
  pdfBuilder.addText(`Netto: ${euroValue(netto)}`, 9, 6, 'right');
  pdfBuilder.addText(`MwSt. ${MWST}%: ${euroValue(tax)}`, 9, 6, 'right');
  pdfBuilder.addLine(PdfBuilder.mm2pt(100));
  pdfBuilder.setBold();

  if (isTime === true) {
    pdfBuilder.addText(`Gesamtpreis für ${order.timeBased?.hours || ''} Stunden: ${euroValue(price)}`, 14, 10, 'right');
    pdfBuilder.setNormal();
    pdfBuilder.addText(
      `Je angefangene weitere Stunde: ${euroValue(order.timeBased?.extra)} inkl. MwSt.`,
      9,
      6,
      'right',
    );
    pdfBuilder.addText(
      'Bei einer Zeitüberschreitung von bis zu 20 min ist 1/2 Stunde zu bezahlen, ab 20 min wird eine volle Stunde berechnet.',
      9,
      6,
      'right',
    );
  } else {
    pdfBuilder.addText(`Gesamt: ${euroValue(price)}`, 14, 10, 'right');
  }
  pdfBuilder.setNormal();
};

const addTopPageTextSecondPage = (pdfBuilder: PdfBuilder) => {
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

  pdfBuilder.resetText();

  textBlocks.forEach((block) => {
    pdfBuilder.addTable({ head: null, body: [[`• ${block}`]], columnStyles: { 0: { lineColor: [255, 255, 255] } } });
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

const addVerpackung = (pdfBuilder: PdfBuilder, order: Order, serv: OrderService[]) => {
  pdfBuilder.addBlackHeader('Verpackung (wird nach Verbrauch berechnet)');

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

  pdfBuilder.addTable({
    head,
    body,
    columnStyles: {
      1: { cellWidth: CELL_WIDTH_0, halign: 'right' },
      2: { cellWidth: CELL_WIDTH_0, halign: 'right' },
      3: { cellWidth: CELL_WIDTH_0, halign: 'right' },
    },
  });
};

const addServices = (pdfBuilder: PdfBuilder, order: Order, serv: OrderService[]) => {
  pdfBuilder.addBlackHeader('Leistungen');

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

  pdfBuilder.addTable({
    head,
    body,
    columnStyles: {
      1: { cellWidth: CELL_WIDTH_0, halign: 'right' },
      2: { cellWidth: CELL_WIDTH_0, halign: 'right' },
      3: { cellWidth: CELL_WIDTH_0, halign: 'right' },
    },
  });
};

const addSecondPageEnd = (pdfBuilder: PdfBuilder) => {
  pdfBuilder.resetText();
  pdfBuilder.addText(
    'Nach der Besichtigung wurden Mängel festgestellt: [ ] keine   [ ] Wände   [ ] Möbel   [ ] Fußböden',
  );

  pdfBuilder.setBold();
  pdfBuilder.addText('Auszugsadresse');
  pdfBuilder.resetText();
  pdfBuilder.setColor(PRIMARY[0], PRIMARY[1], PRIMARY[2]);
  pdfBuilder.addText(
    '    Umzugsgut vollständig beladen:                                       (Kundenunterschrift) ___________________________',
  );
  pdfBuilder.resetText();

  pdfBuilder.setBold();
  pdfBuilder.addText('Einzugsadresse');
  pdfBuilder.resetText();
  pdfBuilder.setColor(PRIMARY[0], PRIMARY[1], PRIMARY[2]);
  pdfBuilder.addText(
    '    Auftrag vollständig und zufriedenstellend ausgeführt:      (Kundenunterschrift) ___________________________',
  );
  pdfBuilder.resetText();

  pdfBuilder.setBold();
  pdfBuilder.addText(
    'Gesamtbetrag dankend erhalten:                          (Unterschrift des Fahrers) ___________________________',
  );
  pdfBuilder.resetText();
};

const addMontageList = (pdfBuild: PdfBuilder, order: Order) => {
  if (order.from.demontage) {
    pdfBuild.addBlackHeader('Demonatage & Montage Liste');
    const body = [
      ['Küche', numberValue(order.from.kitchenWidth), 'Meter'],
      ['Betten', numberValue(order.from.bedNumber), 'Stück'],
      ['Schränke', numberValue(order.from.wardrobeWidth), 'Meter'],
    ];
    pdfBuild.addTable({ head: null, body, columnStyles: { 1: { halign: 'right' } } });
  }
};

const addMoreInformation = (pdfBuilder: PdfBuilder, order: Order) => {
  pdfBuilder.addPage();
  if (order.text) {
    pdfBuilder.addBlackHeader('Weitere Informationen');
    const body = [[order.text]];

    pdfBuilder.addTable({ head: null, body, columnStyles: { 0: { lineColor: [255, 255, 255] } } });
  }
};

const addMoebel = (pdfBuilder: PdfBuilder, order: Order) => {
  const title = 'Möbelliste';
  if (order.ownItems?.trim().length > 0) {
    pdfBuilder.addBlackHeader(title);
    pdfBuilder.addTable({ head: null, body: [[order.ownItems]] });
  } else if (order.items?.length > 0) {
    pdfBuilder.addBlackHeader(title);
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
            colSpan: 2,
            content: actualroom,

            styles: {
              fontStyle: 'bold',
              halign: 'left',
              textColor: SECONDARY,
            },
          },
        });
      }

      body.push([curItem.name, numberValue(curItem.colli)]);
    }

    pdfBuilder.addTable({ head: null, body });
  }
};

function addBoxes(pdffactory: PdfBuilder, order: Order) {
  const textBlocks = [];
  if (order.boxNumber) {
    textBlocks.push(`Umzugskartons: ca ${order.boxNumber}`);
  }
  if (order.kleiderboxNumber) {
    textBlocks.push(`Kleiderboxen: ca ${order.kleiderboxNumber}`);
  }
  if (textBlocks.length > 0) {
    pdffactory.addSpace(5);
    pdffactory.setBold();
  }
  pdffactory.addText(textBlocks.join(' | '), 9);
  pdffactory.setNormal();
}

const addAGB = (pdfBuilder: PdfBuilder, options: AppOptions): void => {
  pdfBuilder.addPage({ top: 3, left: 8, right: 8, bottom: 3 });
  pdfBuilder.setBold();
  pdfBuilder.addText('Allgemeine Geschäftsbedingungen der Durchführung des Umzugs', 7);
  pdfBuilder.resetText();

  addAgbText(pdfBuilder, options);

  pdfBuilder.addSpace(2);

  pdfBuilder.setBold();
  pdfBuilder.addText('Ich akzeptiere die allgemeinen Geschäftsbediengungen der Firma Umzug Ruckzuck', 8);
  pdfBuilder.setNormal();
  addSignature(pdfBuilder, 'Kundenunterschrift');
};

const addAgbText = (pdfBuilder: PdfBuilder, options: AppOptions) => {
  agb.forEach((paragraph, index) => {
    pdfBuilder.addTable({
      head: [[`§${index + 1} ${paragraph.title}`]],
      body: [[paragraph.text]],
      columnStyles: { 0: { fontSize: 7, lineColor: [255, 255, 255] } },
      headStyles: { fontSize: 7, fillColor: [255, 255, 255], textColor: [0, 0, 0] },
      margin: 8,
    });

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
