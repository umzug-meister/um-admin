import { Grid } from '@mui/material';

import { OptionInput } from '../components/OptionInput';
import { AppCard } from '../components/shared/AppCard';
import { AppGridContainer } from '../components/shared/AppGridContainer';

export function Options() {
  return (
    <AppGridContainer>
      <Grid item xs={6} xl={4}>
        <AppCard title="Berechnungsoptionen">
          <OptionInput name="boxCbm" label="Umzugskarton Volumen" type="number" endAdornment="m³" />
          <OptionInput name="kleiderboxCbm" label="Kleiderbox Volumen" type="number" endAdornment="m³" />
        </AppCard>
      </Grid>

      <Grid item xs={6} xl={4}>
        <AppCard title="Server Einstellungen">
          <OptionInput name="origin" label="Standort" />
          <OptionInput name="gapikey" label="Google Api Key" asPassword />
          {/* <OptionInput name="clientId" label="Google Client ID" asPassword /> */}
          <OptionInput name="jfApiKey" label="JotForm Api Key" asPassword />
        </AppCard>
      </Grid>
    </AppGridContainer>
  );
}
