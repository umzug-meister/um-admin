import { Box, Grid2, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useMemo, useState } from 'react';

import { AppCard } from '../components/shared/AppCard';
import { AppGridContainer } from '../components/shared/AppGridContainer';
import { RootBox } from '../components/shared/RootBox';
import { useAppServices } from '../hooks/useAppServices';
import { getColorBySrc } from '../utils/utils';

import { AppCounter } from '@umzug-meister/um-core';
import { orderSrcTypes } from '@umzug-meister/um-core/constants';
import { capitalize } from 'lodash';

export default function Leads() {
  const counters = useAppServices<AppCounter>('Counter');

  const leadsCounter = counters?.find((c) => c.type === 'Lead');

  const [date, setDate] = useState(new Date());

  const [dataForYear, setDataForYear] = useState<any>(leadsCounter?.data['#' + date.getFullYear()]);

  const SERIES = useMemo(() => {
    return orderSrcTypes.map((src) => ({
      dataKey: src,
      label: capitalize(src),
      color: getColorBySrc(src),
    }));
  }, []);

  const MIN_DATE = useMemo(() => new Date(new Date().setFullYear(2024)), []);
  const MAX_DATE = useMemo(() => new Date(), []);

  if (!leadsCounter) {
    return <Typography>keine Daten vorhanden</Typography>;
  }

  const onYearChange = (date: Date) => {
    setDate(date);
    const currentData = leadsCounter.data['#' + date.getFullYear()];
    setDataForYear(currentData);
  };

  const dataset = convert2DataSet({ dataForYear, year: date.getFullYear() });

  return (
    <RootBox>
      <AppGridContainer>
        <Grid2 size={12}>
          <AppCard title="Anfragen">
            <Box>
              <DatePicker
                maxDate={MAX_DATE}
                minDate={MIN_DATE}
                value={date}
                label="Jahr"
                views={['year']}
                onYearChange={onYearChange}
              />
            </Box>
            <Box height={650}>
              <BarChart
                leftAxis={null}
                borderRadius={4}
                barLabel="value"
                dataset={dataset}
                xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
                series={SERIES}
              />
            </Box>
          </AppCard>
        </Grid2>
      </AppGridContainer>
    </RootBox>
  );
}

function getMonthName(monthNumber: string, year: number) {
  return monthNumber.replace('#', '').padStart(2, '0') + '/' + (year - 2000);
}

type DataForYearType = { [month: string]: any };

type Convert2DataSetParams = {
  dataForYear: DataForYearType | undefined;
  year: number;
};
function sortMonths(a: string, b: string): number {
  const aMonth = Number(a.replace('#', ''));
  const bMonth = Number(b.replace('#', ''));
  return aMonth - bMonth;
}

function convert2DataSet({ year, dataForYear }: Convert2DataSetParams) {
  const dataset: any[] = [];
  if (!dataForYear) return dataset;

  const months = Object.keys(dataForYear).toSorted(sortMonths);

  months.forEach((month) => {
    const leads = dataForYear[month];

    const entry: any = {
      month: getMonthName(month, year),
    };

    orderSrcTypes.forEach((src) => {
      const countBySrc = leads.filter((l: any) => l.src === src);
      entry[src] = countBySrc.length;
    });

    dataset.push(entry);
  });
  return dataset;
}
