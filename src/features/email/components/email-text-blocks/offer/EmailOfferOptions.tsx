import { Costs, EmailServicesTable } from '../../../../../../EmailServicesTable';
import { WorkerCosts } from './WorkerCosts';

import { Order } from '@umzug-meister/um-core';

export function EmailOfferOptions({ order }: Readonly<{ order: Order }>) {
  return (
    <>
      <WorkerCosts order={order} />
      <EmailServicesTable order={order} />
      <br />
      <Costs order={order} />
    </>
  );
}
