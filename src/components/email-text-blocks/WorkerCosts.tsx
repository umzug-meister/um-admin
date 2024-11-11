import { euroValue, getOrtFromAdress } from '../../utils/utils';
import { Dotted } from './Dotted';

import { Order } from 'um-types';

export function WorkerCosts({ order }: Readonly<{ order: Order }>) {
  const { workersNumber, transporterNumber, timeBased, from, to } = order;

  const workersAndTransporters = [`${workersNumber} Träger/Ladehelfer`];

  if (transporterNumber) {
    workersAndTransporters.push(`mit ${transporterNumber} x LKW (à 3,5 t mit 20 m³ Ladevermögen)`);
  }

  let baseHours = '';
  if (timeBased?.hours) {
    baseHours += `Mind. Abnahme ${timeBased.hours} Stunden`;
    const startLocation = getOrtFromAdress(from);
    const endLocation = getOrtFromAdress(to);
    if (startLocation && endLocation) {
      baseHours += ` (Anfang in ${startLocation}, Ende in ${endLocation})`;
    }
    baseHours += ': ';
  }
  baseHours += `${euroValue(timeBased.basis)} inkl. MwSt.`;

  let extraHours: string | undefined;
  if (timeBased?.extra) {
    extraHours = `Jede weitere Stunde: ${euroValue(timeBased.extra)} inkl. MwSt.`;
  }

  return (
    <>
      <br />
      <h3>👨‍🔧 Personalkosten</h3>
      <Dotted>{workersAndTransporters.join(' ')}</Dotted>
      <Dotted>{baseHours}</Dotted>
      {extraHours && <Dotted>{extraHours}</Dotted>}
    </>
  );
}
