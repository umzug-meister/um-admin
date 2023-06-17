import BoyOutlinedIcon from '@mui/icons-material/BoyOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import { Box, Divider, Grid, Tab, Tabs, Typography } from '@mui/material';

import { useState } from 'react';

import OfferTab from '../components/OfferTab';
import { AppCard } from '../components/shared/AppCard';
import { AppGridContainer } from '../components/shared/AppGridContainer';
import { TabPanel } from '../components/shared/TabPanel';

export default function OffersEditor() {
  const [value, setValue] = useState(0);

  return (
    <AppGridContainer>
      <Grid item xs={12}>
        <AppCard title="">
          <Tabs
            value={value}
            onChange={(_, newValue) => {
              setValue(newValue);
            }}
          >
            <Tab icon={<TabIcon t35={1} workers={2} />} />
            <Tab icon={<TabIcon t35={1} workers={3} />} />
            <Tab icon={<TabIcon t35={1} workers={4} />} />
            <Tab icon={<TabIcon t35={2} workers={4} />} />
            <Tab icon={<TabIcon t35={2} workers={5} />} />
            <Tab icon={<TabIcon t35={2} workers={6} />} />
            <Tab icon={<TabIcon t35={3} workers={6} />} />
          </Tabs>
          <TabPanel index={0} value={value}>
            <OfferTab t35={1} workers={2} />
          </TabPanel>
          <TabPanel index={1} value={value}>
            <OfferTab t35={1} workers={3} />
          </TabPanel>
          <TabPanel index={2} value={value}>
            <OfferTab t35={1} workers={4} />
          </TabPanel>
          <TabPanel index={3} value={value}>
            <OfferTab t35={2} workers={4} />
          </TabPanel>
          <TabPanel index={4} value={value}>
            <OfferTab t35={2} workers={5} />
          </TabPanel>
          <TabPanel index={5} value={value}>
            <OfferTab t35={2} workers={6} />
          </TabPanel>
          <TabPanel index={6} value={value}>
            <OfferTab t35={3} workers={6} />
          </TabPanel>
        </AppCard>
      </Grid>
    </AppGridContainer>
  );
}

interface TabIconProps {
  t35: number;
  workers: number;
}

function TabIcon({ t35, workers }: TabIconProps) {
  return (
    <Box paddingX={1} display="flex" gap={0.5} alignContent="center">
      <Typography>{workers}</Typography>
      <BoyOutlinedIcon />
      <Divider orientation="vertical" flexItem />
      <Typography>{t35}</Typography>
      <LocalShippingOutlinedIcon />
    </Box>
  );
}
