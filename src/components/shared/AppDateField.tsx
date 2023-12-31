import { DatePicker } from '@mui/x-date-pickers';

import { getParseableDate } from '../../utils/utils';

import { formatISO } from 'date-fns';

interface AppDateFieldProps {
  label?: string;
  disabled?: boolean;
  minDate?: Date;
  value: string;
  onDateChange: (value: string) => void;
}

export function AppDateField({ label, disabled, value, minDate, onDateChange }: Readonly<AppDateFieldProps>) {
  const currentValue = value ? getParseableDate(value) : '';

  return (
    <DatePicker
      minDate={minDate}
      label={label}
      disabled={disabled}
      value={new Date(currentValue)}
      slotProps={{
        textField: {
          size: 'small',
          inputProps: {
            'data-hj-allow': '',
          },
        },
      }}
      onChange={(value) => {
        if (value) {
          try {
            const next = formatISO(value, { representation: 'date' });
            onDateChange(next);
          } catch (e) {}
        }
      }}
      onAccept={(value: Date | null) => {
        if (value) {
          const next = formatISO(value, { representation: 'date' });
          onDateChange(next);
        }
      }}
    />
  );
}
