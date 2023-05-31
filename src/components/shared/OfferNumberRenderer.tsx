interface Props {
  value: any;
  color: 'red' | 'blue' | 'green' | 'orange';
}
export default function OfferNumberRenderer({ value, color }: Props) {
  const valueAsNumber = Number(value || 0);
  const percent = (valueAsNumber / 8) * 100 + 7;

  return (
    <b
      style={{
        fontFamily: 'monospace',
        width: '20px',
        height: '20px',
        lineHeight: '20px',
        textAlign: 'center',
        fontSize: '18px',
        color: 'white',
        borderRadius: '50%',
        backgroundColor: `color-mix(in srgb, ${color} ${Math.min(percent, 100)}%, white)`,
      }}
    >
      {valueAsNumber}
    </b>
  );
}
