import { useCurrentOrder } from '../../../../../hooks/useCurrentOrder';
import { euroValue, getOrtFromAdress } from '../../../../../utils/utils';
import { QuillCell, QuillTable } from '../QuillTableComponents';

import { Address, Order } from '@umzug-meister/um-core';

function generateBaseText(workersNumber: number, transporterNumber?: number) {
  const pieces = [`${workersNumber} Mann`];

  if (transporterNumber) {
    pieces.push(`mit ${transporterNumber} x LKW (à 3,5t / 20 m³)`);
  }
  return pieces.join(' ');
}

function generateHoursText(hours: number, from: Address, to: Address) {
  return `Mindestabnahme ${hours} Stunden (Start: ${getOrtFromAdress(from)}, Ende: ${getOrtFromAdress(to)})`;
}

export function WorkerCosts({ order }: Readonly<{ order: Order }>) {
  const { workersNumber, transporterNumber, timeBased } = order;

  const basisText = generateBaseText(workersNumber, transporterNumber);

  return (
    <>
      <h3>👨‍🔧 Personalkosten</h3>
      <QuillTable>
        {timeBased.hours ? <TimeBasedWorkerCosts /> : <FixWorkerCosts basis={timeBased.basis} basisText={basisText} />}
      </QuillTable>
    </>
  );
}

function TimeBasedWorkerCosts() {
  const order = useCurrentOrder();

  if (!order) return null;

  const { timeBased, workersNumber, transporterNumber } = order;
  const { basis, hours } = timeBased;

  const hoursAsNumber = Number(hours);
  if (!timeBased) return null;

  return (
    <>
      <tr>
        <QuillCell fontWeight="bold">{generateBaseText(workersNumber, transporterNumber)}</QuillCell>
        <QuillCell />
      </tr>
      <tr>
        <QuillCell>{generateHoursText(Number(timeBased.hours), order.from, order.to)}</QuillCell>
        <QuillCell textAlign="right">{euroValue(basis)}</QuillCell>
      </tr>
      <tr>
        <QuillCell>{`Jede weitere Stunde: ${euroValue(timeBased.extra)}`}</QuillCell>
        <QuillCell />
      </tr>
      {hoursAsNumber <= 4 && (
        <tr>
          <QuillCell>{`Maximale Abnahme: ${hoursAsNumber + 1} Stunden`}</QuillCell>
          <QuillCell />
        </tr>
      )}
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
