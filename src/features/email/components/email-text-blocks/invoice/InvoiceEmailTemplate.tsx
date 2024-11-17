import { useCurrentOrder } from '../../../../../hooks/useCurrentOrder';
import { anrede } from '../../../../../utils/utils';

export function InvoiceEmailTemplate() {
  const order = useCurrentOrder();

  if (!order) return null;

  return (
    <>
      <p>{anrede(order.customer)}</p>

      <p>
        herzlichen Dank, dass Sie sich für unsere Leistungen entschieden haben. Anbei finden Sie Ihre Rechnung im
        Anhang.
        <br />
        Bei Fragen stehen wir Ihnen jederzeit gerne zur Verfügung.
      </p>
    </>
  );
}
