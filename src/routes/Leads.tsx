import { Box, Grid2, Typography } from '@mui/material';
import { AppGridContainer } from '../components/shared/AppGridContainer';
import { AppCard } from '../components/shared/AppCard';
import { useAppServices } from '../hooks/useAppServices';
import { AppCounter } from 'um-types';
import { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function Leads() {
  const counters = useAppServices<AppCounter>('Counter');

  const leadsCounter = counters?.find((c) => c.type === 'Lead');

  const [dataSet, setDataSet] = useState<any>([]);

  const [date, setDate] = useState(new Date());

  if (!leadsCounter) {
    return <Typography>keine Leads vorhanden</Typography>;
  }
  const onYearChange = (date: Date) => {
    setDate(date);

    const currentData = leadsCounter.data['#' + date.getFullYear()];
    console.log(currentData);
  };

  return (
    <AppGridContainer>
      <Grid2 size={12}>
        <AppCard title="Leads">
          <Box>
            <DatePicker value={date} label="Jahr" views={['year']} onYearChange={onYearChange} />
          </Box>
        </AppCard>
      </Grid2>
    </AppGridContainer>
  );
}
