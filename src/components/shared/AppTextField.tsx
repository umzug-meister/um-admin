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
 */

export function AppTextField(props: TextFieldProps) {
  const { value = '' } = props;

  const standardProps: TextFieldProps = {
    variant: 'outlined',
    fullWidth: true,
    size: 'small',
  };

  return <TextField minRows={8} {...standardProps} {...props} value={value} />;
}
