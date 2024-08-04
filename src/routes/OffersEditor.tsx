import BoyOutlinedIcon from '@mui/icons-material/BoyOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import { Box, Divider, Grid, Tab, Typography } from '@mui/material';

import EditOffersCard from '../components/EditOffersCard';
import { AppCard } from '../components/shared/AppCard';
import { AppGridContainer } from '../components/shared/AppGridContainer';

export default function OffersEditor() {
  return (
    <>
      <OfferContainer lkw={1} workers={[2, 3, 4]} />
      <OfferContainer lkw={2} workers={[3, 4, 5, 6, 7, 8]} />
      <OfferContainer lkw={3} workers={[5, 6, 7, 8]} />
    </>
  );
}

function OfferContainer({ lkw, workers }: Readonly<{ lkw: number; workers: number[] }>) {
  return (
    <>
      <Typography variant="h4">{lkw} LKW</Typography>
      <AppGridContainer>
        {workers.map((w) => (
          <OfferCardWrapper key={w} t35={lkw} workers={w} />
        ))}
      </AppGridContainer>
    </>
  );
}

interface Props {
  t35: number;
  workers: number;
}

function OfferCardWrapper(props: Readonly<Props>) {
  return (
    <Grid item xs={4}>
      <AppCard title={<Tab icon={<TabIcon {...props} />} />}>
        <EditOffersCard {...props} />
      </AppCard>
    </Grid>
  );
}

function TabIcon({ t35, workers }: Readonly<Props>) {
  return (
    <Box display="flex" justifyContent="center" width="100%">
      <Box display="flex" gap={1} alignItems="center">
        <Typography variant="h5">{workers}</Typography>
        <BoyOutlinedIcon fontSize="large" />
        <Divider orientation="vertical" flexItem />
        <Typography variant="h5">{t35}</Typography>
        <LocalShippingOutlinedIcon fontSize="large" />
      </Box>
    </Box>
  );
}
