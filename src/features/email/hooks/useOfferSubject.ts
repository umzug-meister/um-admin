import { useEffect, useState } from 'react';

export function useOfferSubject(orderId: number): [string, (value: string) => void] {
  const [subject, setSubject] = useState('');
  useEffect(() => {
    setSubject(`📦 Umzugsangebot zu Ihrer Anfrage ${orderId}`);
  }, [orderId]);

  return [subject, setSubject as (value: string) => void] as const;
}
