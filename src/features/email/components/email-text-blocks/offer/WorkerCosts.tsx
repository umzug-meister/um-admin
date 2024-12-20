import { euroValue, getOrtFromAdress } from '../../../../../utils/utils';
import { QuillCell, QuillTable } from '../QuillTableComponents';

import { Order } from 'um-types';

export function WorkerCosts({ order }: Readonly<{ order: Order }>) {
  const { workersNumber, transporterNumber, timeBased } = order;

  const arr = [`${workersNumber} Mann`];

  if (transporterNumber) {
    arr.push(`mit ${transporterNumber} x LKW (à 3,5t / 20 m³)`);
  }

  const basisText = arr.join(' ');

  return (
    <>
      <h3>👨‍🔧 Personalkosten</h3>
      <QuillTable>
        {timeBased.hours ? (
          <TimeBasedWorkerCosts
            basisText={basisText}
            hoursText={`Mindestabnahme ${timeBased.hours} Stunden (Start: ${getOrtFromAdress(order.from)}, Ende: ${getOrtFromAdress(order.to)}) `}
            basis={timeBased.basis}
            extraHoursText={`Jede weitere Stunde: ${euroValue(timeBased.extra)}`}
          />
        ) : (
          <FixWorkerCosts basis={timeBased.basis} basisText={basisText} />
        )}
      </QuillTable>
    </>
  );
}

function TimeBasedWorkerCosts({
  basisText,
  basis,
  hoursText,
  extraHoursText,
}: Readonly<{ basis: string | number | undefined; basisText: string; hoursText: string; extraHoursText: string }>) {
  return (
    <>
      <tr>
        <QuillCell fontWeight="bold">{basisText}</QuillCell>
        <QuillCell />
      </tr>
      <tr>
        <QuillCell>{hoursText}</QuillCell>
        <QuillCell textAlign="right">{euroValue(basis)}</QuillCell>
      </tr>
      <tr>
        <QuillCell>{extraHoursText}</QuillCell>
        <QuillCell />
      </tr>
    </>
  );
}

function FixWorkerCosts({ basisText, basis }: Readonly<{ basis: string | number | undefined; basisText: string }>) {
  return (
    <tr>
      <QuillCell fontWeight="bold">{basisText}</QuillCell>
      <QuillCell>{euroValue(basis)}</QuillCell>
    </tr>
  );
}
