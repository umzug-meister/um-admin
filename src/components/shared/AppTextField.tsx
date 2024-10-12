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

  return <TextField minRows={8} variant="outlined" fullWidth {...props} value={value} size="small" />;
}
