import { Costs, EmailServicesTable } from './EmailServicesTable';
import { WorkerCosts } from './WorkerCosts';

import { Order } from 'um-types';

export function EmailOfferOptions({ order }: Readonly<{ order: Order }>) {
  return (
    <>
      <WorkerCosts order={order} />
      <EmailServicesTable order={order} />
      <Costs order={order} />
    </>
  );
}
