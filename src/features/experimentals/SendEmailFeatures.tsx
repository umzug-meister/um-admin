import { FormControlLabel, FormGroup, Switch } from '@mui/material';

import { useLocalStorage } from '../../hooks/useLocalStorage';

export default function SendEmailFeatures() {
  const [enabled, setEnabled] = useLocalStorage('send-mail');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnabled(event.target.checked);
  };

  return (
    <FormGroup>
      <FormControlLabel control={<Switch checked={enabled} onChange={handleChange}></Switch>} label="E-Mail Versand" />
    </FormGroup>
  );
}
