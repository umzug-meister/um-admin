import { OPTIONS } from './constants';

import { Rechnung, Service } from '@umzug-meister/um-core';

type ObjectValues<T> = T[keyof T];

export type AppOptions = {
  [index in OptionName]: string;
};

export type OptionName = ObjectValues<typeof OPTIONS>;

export type RechnungProp = keyof Rechnung;

export type AppServices = {
  all: Service[];
};
