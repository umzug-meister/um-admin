import { Grid } from '@mui/material';

import { OptionInput } from '../components/OptionInput';
import { AppCard } from '../components/shared/AppCard';
import { AppGridContainer } from '../components/shared/AppGridContainer';
import SendEmailFeatures from '../features/experimentals/SendEmailFeatures';

export default function Options() {
  return (
    <AppGridContainer>
      <Grid size={{ xs: 6, xl: 4 }}>
        <AppCard title="Berechnungsoptionen">
          <OptionInput name="boxCbm" label="Umzugskarton Volumen" type="number" endAdornment="m³" />
          <OptionInput name="kleiderboxCbm" label="Kleiderbox Volumen" type="number" endAdornment="m³" />
        </AppCard>
      </Grid>

      <Grid size={{ xs: 6, xl: 4 }}>
        <AppCard title="Server Einstellungen">
          <OptionInput name="origin" label="Standort" />
          <OptionInput name="dataPrivacyUrl" label="Datenschutz URL" />
          <OptionInput name="successUrl" label="Success URL" />
          <OptionInput name="boxCalculatorUrl" label="Kartonrechner URL" />
        </AppCard>
      </Grid>
      <Grid size={{ xs: 6, xl: 4 }}>
        <AppCard title="Experimentelle Einstellungen">
          <SendEmailFeatures />
        </AppCard>
      </Grid>
    </AppGridContainer>
  );
}
