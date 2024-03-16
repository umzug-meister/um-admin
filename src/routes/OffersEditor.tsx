import BoyOutlinedIcon from '@mui/icons-material/BoyOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import { Box, Divider, Grid, Tab, Typography } from '@mui/material';

import EditOffersCard from '../components/EditOffersCard';
import { AppCard } from '../components/shared/AppCard';
import { AppGridContainer } from '../components/shared/AppGridContainer';

export default function OffersEditor() {
  return (
    <>
      <AppGridContainer>
        <OfferCardWrapper t35={1} workers={2} />
        <OfferCardWrapper t35={1} workers={3} />
        <OfferCardWrapper t35={1} workers={4} />
      </AppGridContainer>
      <AppGridContainer>
        <OfferCardWrapper t35={2} workers={4} />
        <OfferCardWrapper t35={2} workers={5} />
        <OfferCardWrapper t35={2} workers={6} />
        <OfferCardWrapper t35={2} workers={7} />
        <OfferCardWrapper t35={2} workers={8} />
      </AppGridContainer>
      <AppGridContainer>
        <OfferCardWrapper t35={3} workers={5} />
        <OfferCardWrapper t35={3} workers={6} />
        <OfferCardWrapper t35={3} workers={7} />
        <OfferCardWrapper t35={3} workers={8} />
      </AppGridContainer>
    </>
  );
}

interface Props {
  t35: number;
  workers: number;
}

function OfferCardWrapper(props: Props) {
  return (
    <Grid item xs={4}>
      <AppCard title={<Tab icon={<TabIcon {...props} />} />}>
        <EditOffersCard {...props} />
      </AppCard>
    </Grid>
  );
}

function TabIcon({ t35, workers }: Props) {
  return (
    <Box display="flex" justifyContent="center" width="100%">
      <Box display="flex" gap={1} alignItems="center">
        <Typography variant="h4">{workers}</Typography>
        <BoyOutlinedIcon fontSize="large" />
        <Divider orientation="vertical" flexItem />
        <Typography variant="h4">{t35}</Typography>
        <LocalShippingOutlinedIcon fontSize="large" />
      </Box>
    </Box>
  );
}
