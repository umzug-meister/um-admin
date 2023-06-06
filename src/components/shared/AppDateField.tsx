import { DatePicker } from '@mui/x-date-pickers';

import { getParseableDate } from '../../utils/utils';

interface AppDateFieldProps {
  label?: string;
  disabled?: boolean;
  value: string;
  onDateChange: (value: string) => void;
}

export function AppDateField({ label, disabled, value, onDateChange }: AppDateFieldProps) {
  const currentValue = value ? getParseableDate(value) : '';

  return (
    <DatePicker
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
      onAccept={(value: Date | null) => {
        console.log(value);
        if (value) {
          const next = value.toLocaleDateString('ru');
          onDateChange(next);
        }
      }}
    />
  );
}
