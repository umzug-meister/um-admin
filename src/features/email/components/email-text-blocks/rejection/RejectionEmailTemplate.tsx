import { useCurrentOrder } from '../../../../../hooks/useCurrentOrder';
import { anrede } from '../../../../../utils/utils';

export function RejectionEmailTemplate() {
  const order = useCurrentOrder();

  if (!order) return null;

  return (
    <>
      <p>{anrede(order.customer)}</p>

      <p>
        wir bedauern sehr, Ihnen mitteilen zu müssen, dass wir derzeit leider keine Kapazitäten haben, um Ihren Umzug
        übernehmen zu können. Daher können wir Ihnen momentan kein Angebot unterbreiten. Wir wünschen Ihnen jedoch viel
        Erfolg bei der weiteren Suche nach einem passenden Umzugsunternehmen.
      </p>
    </>
  );
}
