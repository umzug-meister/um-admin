import { OPTIONS } from './main';

import { Rechnung, Service } from 'um-types';

type ObjectValues<T> = T[keyof T];

export type AppOptions = {
  [index in OptionName]: string;
};

export type OptionName = ObjectValues<typeof OPTIONS>;

export type RechnungProp = keyof Rechnung;

export type AppServices = {
  all: Service[];
};
