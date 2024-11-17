import { useEffect, useState } from 'react';

import { useCurrentOrder } from '../../../hooks/useCurrentOrder';

export function useOfferSubject() {
  const order = useCurrentOrder();
  const [subject, setSubject] = useState('');
  useEffect(() => {
    if (order) {
      setSubject(`📦 Umzugsangebot zu Ihrer Anfrage ${order.id}`);
    }
  }, [order]);

  return [subject, setSubject as (value: string) => void] as const;
}
