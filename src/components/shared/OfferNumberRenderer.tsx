import { Chip } from '@mui/material';

interface Props {
  value: any;
  color: 'red' | 'blue' | 'green' | 'orange';
}
export default function OfferNumberRenderer({ value, color }: Props) {
  const valueAsNumber = Number(value || 0);
  const percent = (valueAsNumber / 8) * 100 + 7;

  return (
    <Chip
      style={{
        height: '20px',
        color: 'white',
        fontSize: '0.8rem',
        backgroundColor: `color-mix(in srgb, ${color} ${Math.min(percent, 100)}%, white)`,
      }}
      label={valueAsNumber}
    />
  );
}
