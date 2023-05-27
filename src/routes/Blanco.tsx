import { useState } from 'react';

import { RechnungEditor } from '../components/shared/RechnungEditor';
import { RootBox } from '../components/shared/RootBox';
import { useOption } from '../hooks/useOption';

import { Rechnung } from 'um-types';

export default function Blanco() {
  const rNumber = useOption('rNumber');

  const [rechnung, setrechnung] = useState<Rechnung>({
    rNumber,
    date: new Date().toLocaleDateString('ru'),
  } as Rechnung);

  return (
    <RootBox>
      <RechnungEditor
        rechnung={rechnung}
        onPropChange={(prop, value) => {
          setrechnung((cur) => {
            return { ...cur, [prop]: value };
          });
        }}
      />
    </RootBox>
  );
}
