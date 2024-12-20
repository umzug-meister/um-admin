import { euroValue } from '../../../../../utils/utils';
import { Dotted } from '../Dotted';
import { QuillCell, QuillTable } from '../QuillTableComponents';

import { Order } from 'um-types';

export function WorkerCosts({ order }: Readonly<{ order: Order }>) {
  const { workersNumber, transporterNumber, timeBased } = order;

  const workersAndTransporters = [`${workersNumber} Mann`];

  if (transporterNumber) {
    workersAndTransporters.push(`mit ${transporterNumber} x LKW (à 3,5t / 20 m³)`);
  }

  let baseHours = '';
  if (timeBased?.hours) {
    baseHours += `Mindestabnahme ${timeBased.hours} Stunden`;

    baseHours += ': ';
  }
  // baseHours += `${euroValue(timeBased?.basis)}`;

  let extraHours: string | undefined;
  if (timeBased?.extra) {
    extraHours = `Jede weitere Stunde: ${euroValue(timeBased.extra)}`;
  }

  return (
    <>
      <h3>👨‍🔧 Personalkosten</h3>
      <QuillTable>
        <tr>
          <QuillCell fontWeight="bold">{workersAndTransporters.join(' ')}</QuillCell>
          <QuillCell />
        </tr>
        <tr>
          <QuillCell>{baseHours}</QuillCell>
          <QuillCell textAlign="right">{euroValue(timeBased?.basis)}</QuillCell>
        </tr>
        {extraHours && (
          <tr>
            <QuillCell>{extraHours}</QuillCell>
          </tr>
        )}
      </QuillTable>
    </>
  );
}
