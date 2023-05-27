import { DatePicker } from '@mui/x-date-pickers';

import { getParseableDate } from '../../utils/utils';

import dayjs, { Dayjs } from 'dayjs';

interface AppDateFieldProps {
  label?: string;
  disabled?: boolean;
  value: string;
  onDateChange: (value: string) => void;
}

export function AppDateField({ label, disabled, value, onDateChange }: AppDateFieldProps) {
  const currentValue = value ? dayjs(getParseableDate(value)) : undefined;

  return (
    <DatePicker
      label={label}
      disabled={disabled}
      value={currentValue}
      slotProps={{ textField: { size: 'small' } }}
      onAccept={(value: Dayjs | null) => {
        if (value) {
          const nextValue = value.format('DD.MM.YYYY');

          onDateChange?.(nextValue);
        }
      }}
      format="DD.MM.YYYY"
    />
  );
}
