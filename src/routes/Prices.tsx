import { Box, Divider, Grid } from '@mui/material';

import { Offers } from '../components/Offers';
import { OptionInput } from '../components/OptionInput';
import { AppCard } from '../components/shared/AppCard';
import { AppGridContainer } from '../components/shared/AppGridContainer';

const aProps = {
  type: 'number' as 'number',
  endAdornment: '€',
};

export default function Prices() {
  return (
    <AppGridContainer>
      <Grid item xs={8}>
        <AppCard title="Umzugsangebote">
          <Offers />
        </AppCard>
      </Grid>

      <Grid item xs={4}>
        <AppCard title="Preise">
          <OptionInput name="aBettDeMon" label="Bett Demontage" {...aProps} />

          <OptionInput name="aBoxPack" label="Ein Karton zusätzlich einpacken oder auspacken" {...aProps} />

          <OptionInput name="acbm" label="Je zusätzliche m³" {...aProps} />

          <OptionInput name="aetage" label="Je zusätzliche Etage" {...aProps} />

          <OptionInput name="akitmon" label="Küche Demontage pro Meter" {...aProps} />

          <OptionInput name="ameter" label="Je zuätzliche 10 Meter Laufweg" {...aProps} />

          <OptionInput name="awardmon" label="Schrank De/Montage pro Meter" {...aProps} />

          <OptionInput name="disposalBasicPrice" label="Abfall Abfuhr Pauschale" {...aProps} />

          <OptionInput name="disposalCbmPrice" label="Preis pro m³ Abfall" {...aProps} />
          <Box p={1}>
            <Divider />
          </Box>

          <OptionInput name="kmPrice" label="Kilometer Preis" {...aProps} />
          <OptionInput name="hvzPrice" label="Halteverbotszone Preis" {...aProps} />
        </AppCard>
      </Grid>
    </AppGridContainer>
  );
}
