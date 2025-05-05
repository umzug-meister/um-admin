import { Grid2 } from '@mui/material';

import { OptionInput } from '../components/OptionInput';
import { AppCard } from '../components/shared/AppCard';
import { AppGridContainer } from '../components/shared/AppGridContainer';

export default function Options() {
  return (
    <AppGridContainer>
      <Grid2 size={{ xs: 6 }}>
        <AppCard title="Berechnungsoptionen">
          <OptionInput name="boxCbm" label="Umzugskarton Volumen" type="number" endAdornment="m³" />
          <OptionInput name="kleiderboxCbm" label="Kleiderbox Volumen" type="number" endAdornment="m³" />
        </AppCard>
      </Grid2>

      <Grid2 size={{ xs: 6 }}>
        <AppCard title="Server Einstellungen">
          <OptionInput name="origin" label="Standort" />
          <OptionInput name="dataPrivacyUrl" label="Datenschutz URL" />
          <OptionInput name="successUrl" label="Success URL" />
          <OptionInput name="boxCalculatorUrl" label="Kartonrechner URL" />
        </AppCard>
      </Grid2>
    </AppGridContainer>
  );
}
