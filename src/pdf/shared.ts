import PdfBuilder from './PdfBuilder';

import { Color } from 'jspdf-autotable';

const target = import.meta.env.VITE_APP_TARGET;
const is24 = target === 'umzugruckzuck24';

const imageUrl = is24
  ? new URL('../assets/rz24.png', import.meta.url).href
  : new URL('../assets/ruckzuck.png', import.meta.url).href;
console.log('imageUrl', imageUrl);

export const PRIMARY = is24 ? [40, 83, 123] : [25, 120, 186];

export const SECONDARY = [203, 43, 27];
export const WHITE: Color = [255, 255, 255];
export const PRIMARY_LIGHT: Color = is24 ? '#6987a3' : '#3086c1';

export function addHeader(factory: PdfBuilder) {
  const height = is24 ? 34 : 30;
  const width = is24 ? 36 : 38;

  factory.addPngImage(imageUrl, 20, 8, height, width);

  factory.setNormal();
  factory.setColor(60, 60, 60);
  const email = is24 ? 'info@umzugruckzuck24.de' : 'umzugruckzuck@gmail.com';
  factory.addLeftRight(
    [],
    [
      'Alexander Berent',
      'Am Münchfeld 31, 80999 München',
      '089 30642972 | 0176 10171990',
      email,

      'Steuernummer: 144/139/21180',
      '',
      '',
    ],
    8,
  );
}

export function addDate(factory: PdfBuilder, date: string) {
  factory.addSpace(5);
  factory.addLeftRight([], [`München, ${date}`]);
}
