import { TextField, TextFieldProps } from '@mui/material';

/**
 * extends @mui/material/textfield
 *
 * fix: controlled/uncontrolled change
 *
 * fix: send value, not event
 *
 * edit: date in printable format
 *
 * default: small size
 *
 * default: outlined variant
 *
 * default: fullwidth
 *
 * default: minrows=8
 *
 * default: shrink time label
 */

export function AppTextField(props: TextFieldProps) {
  const { value = '' } = props;

  const standardProps: TextFieldProps = {
    variant: 'outlined',
    fullWidth: true,
  };

  let InputLabelProps = undefined;
  if (props.type === 'time') {
    InputLabelProps = { shrink: true };
  }

  return (
    <TextField
      inputProps={{
        'data-hj-allow': '',
      }}
      InputLabelProps={InputLabelProps}
      minRows={8}
      {...standardProps}
      {...props}
      size="small"
      value={value}
    />
  );
}
