import { useEffect, useState } from 'react';

import { useCurrentOrder } from '../../../hooks/useCurrentOrder';

export function useRejectionSubject() {
  const order = useCurrentOrder();
  const [subject, setSubject] = useState('');
  useEffect(() => {
    if (order) {
      setSubject(`Ihre Umzugsanfrage ${order.id}`);
    }
  }, [order]);

  return [subject, setSubject as (value: string) => void] as const;
}
