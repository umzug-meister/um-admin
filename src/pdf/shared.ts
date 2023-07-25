import PdfBuilder from './PdfBuilder';

export const PRIMARY = [25, 120, 186];
export const WHITE = [255, 255, 255];
export const SECONDARY = [203, 43, 27];
export const PRIMARY_LIGHT = '#5ea1cf';

export function addHeader(factory: PdfBuilder) {
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
