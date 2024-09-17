import { Box, Grid2, Typography } from '@mui/material';
import { AppGridContainer } from '../components/shared/AppGridContainer';
import { AppCard } from '../components/shared/AppCard';
import { useAppServices } from '../hooks/useAppServices';
import { AppCounter } from 'um-types';
import { useMemo, useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { orderSrcTypes } from 'um-types/constants';
import { BarChart } from '@mui/x-charts/BarChart';
import { capitalize } from 'lodash';

export default function Leads() {
  const counters = useAppServices<AppCounter>('Counter');

  const leadsCounter = counters?.find((c) => c.type === 'Lead');

  const [date, setDate] = useState(new Date());

  const [dataForYear, setDataForYear] = useState<any>(leadsCounter?.data['#' + date.getFullYear()]);

  const series = useMemo(
    () =>
      orderSrcTypes.map((src) => ({
        dataKey: src,
        label: capitalize(src),
      })),
    [],
  );

  if (!leadsCounter) {
    return <Typography>keine Leads vorhanden</Typography>;
  }

  const onYearChange = (date: Date) => {
    setDate(date);
    const currentData = leadsCounter.data['#' + date.getFullYear()];
    setDataForYear(currentData);
  };

  const dataset = convert2DataSet(dataForYear);

  return (
    <AppGridContainer>
      <Grid2 size={12}>
        <AppCard title="Leads">
          <Box>
            <DatePicker value={date} label="Jahr" views={['year']} onYearChange={onYearChange} />
          </Box>
          <Box height={600}>
            <BarChart
              borderRadius={4}
              barLabel="value"
              dataset={dataset}
              xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
              series={series}
            />
          </Box>
        </AppCard>
      </Grid2>
    </AppGridContainer>
  );
}

function getMonthName(monthNumber: string) {
  const months = [
    'Januar',
    'Februar',
    'März',
    'April',
    'Mai',
    'Juni',
    'Juli',
    'August',
    'September',
    'Oktober',
    'November',
    'Dezember',
  ];

  return months[Number(monthNumber.replace('#', '')) - 1];
}

function convert2DataSet(dataForYear: any) {
  const dataset: any[] = [];

  const months = Object.keys(dataForYear).sort();

  months.forEach((month) => {
    const leads = dataForYear[month];

    const entry: any = {
      month: getMonthName(month),
    };

    orderSrcTypes.forEach((src) => {
      const countBySrc = leads.filter((l: any) => l.src === src);
      entry[src] = countBySrc.length;
    });

    dataset.push(entry);
  });
  return dataset;
}
