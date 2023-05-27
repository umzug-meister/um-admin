import { Box, Grid, Tab, Tabs, useTheme } from '@mui/material';

import { useState } from 'react';

import { CreditContent } from './accounting-components/CreditContent';
import { Mahnung } from './accounting-components/Mahnung';
import { Rechnung } from './accounting-components/Rechnung';
import { TabPanel } from './shared/TabPanel';

export function Accounting() {
  const theme = useTheme();

  const [value, setValue] = useState(0);
  return (
    <Grid item xs={12}>
      <Tabs
        textColor="secondary"
        indicatorColor="secondary"
        value={value}
        onChange={(_, newValue) => {
          setValue(newValue);
        }}
      >
        <Tab label="Rechnung" />
        <Tab label="1. Mahnung" />
        <Tab label="2. Mahnung" />
        <Tab label="3. Mahnung" />
        <Tab label="Gutschrift" />
      </Tabs>
      <Box m={2}>
        <TabPanel index={0} value={value}>
          <Rechnung />
        </TabPanel>
        <TabPanel index={1} value={value}>
          <Mahnung index={1} />
        </TabPanel>
        <TabPanel index={2} value={value}>
          <Mahnung index={2} />
        </TabPanel>
        <TabPanel index={3} value={value}>
          <Mahnung index={3} />
        </TabPanel>
        <TabPanel index={4} value={value}>
          <CreditContent />
        </TabPanel>
      </Box>
    </Grid>
  );
}
