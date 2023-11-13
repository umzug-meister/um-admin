import { euroValue } from '../../utils/utils';

import { TimeBasedPrice } from 'um-types';

interface Props {
  timeBased: TimeBasedPrice | undefined;
}

export function EmailExtraHours({ timeBased }: Readonly<Props>) {
  if (timeBased?.extra) {
    return <p>Jede weitere Stunde: {euroValue(timeBased.extra)} inkl. MwSt.</p>;
  } else {
    return null;
  }
}
