import { Box, Grid2, Typography, useTheme } from '@mui/material';

import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useCurrentOrder } from '../../hooks/useCurrentOrder';
import { useSaveOrder } from '../../hooks/useSaveOrder';
import { generatePaymentReminder } from '../../pdf/PaymentReminderPdf';
import { AppDispatch, AppState } from '../../store';
import { updateOrderProps } from '../../store/appReducer';
import { calculateNumbers, createDueDate, generateText, getNextDueDate, getParseableDate } from '../../utils/utils';
import AddButton from '../shared/AddButton';
import { AppCard } from '../shared/AppCard';
import { AppDateField } from '../shared/AppDateField';
import { AppGridContainer } from '../shared/AppGridContainer';
import { AppTextField } from '../shared/AppTextField';
import { PdfSaveButton } from '../shared/PdfSaveButton';

import { cloneDeep } from 'lodash';
import { DueDate, Rechnung } from 'um-types';

interface Props {
  index: number;
}

export function Mahnung({ index }: Readonly<Props>) {
  const dispatch = useDispatch<AppDispatch>();

  const theme = useTheme();
  const currentOrder = useCurrentOrder();

  const saveOrder = useSaveOrder();

  const curDueDate = useDueDate(index);

  const lastDueDate = useDueDate(index - 1);

  const createDisabled = useMemo(() => {
    if (index === 1) {
      return false;
    } else {
      return typeof lastDueDate === 'undefined';
    }
  }, [index, lastDueDate]);

  const rechnung = currentOrder?.rechnung;

  const printPaymentReminder = useCallback(
    (index: number) => {
      const rechnung = currentOrder?.rechnung;
      if (rechnung) {
        saveOrder(currentOrder).then((order) => {
          if (order !== null) {
            generatePaymentReminder({ index, rechnung });
          }
        });
      }
    },
    [currentOrder, saveOrder],
  );

  const initDueDate = useCallback(() => {
    if (!rechnung) {
      return;
    }

    let sum: number = calculateNumbers(rechnung.entries || []).brutto;
    if (index > 1) {
      sum = rechnung?.dueDates.find((dd) => dd.index === index - 1)?.sum ?? 0;
    }
    const nextDueDate = getNextDueDate({
      date: new Date(getParseableDate(lastDueDate?.date)),
    });

    const text = generateText({ rechnung, index, nextDueDate, sum });

    const dueDate = createDueDate({ date: nextDueDate, index, sum, text });

    dispatch(
      updateOrderProps({
        path: ['rechnung', 'dueDates'],
        value: [...(rechnung?.dueDates || []), dueDate],
      }),
    );
  }, [dispatch, rechnung, index, lastDueDate]);

  const update = useCallback(
    (prop: keyof DueDate, value: any) => {
      const nextDueDates = cloneDeep(rechnung?.dueDates || []);
      const ddToUpdate = nextDueDates.find((dd) => dd.index === index);
      if (ddToUpdate) {
        //@ts-ignore
        ddToUpdate[prop] = value;
        dispatch(
          updateOrderProps({
            path: ['rechnung', 'dueDates'],
            value: nextDueDates,
          }),
        );
      }
    },
    [dispatch, index, rechnung],
  );

  const onPropValue = (prop: keyof DueDate) => {
    return function (value: any) {
      update(prop, value);
    };
  };

  const label = useMemo(() => {
    let text = '';
    switch (index) {
      case 1:
        text = `Rechnung ist fällig am ${lastDueDate?.date}`;
        break;
      case 2:
        text = `1. Mahnung ist fällig am ${lastDueDate?.date}`;
        break;
      case 3:
        text = `2. Mahnung ist fällig am ${lastDueDate?.date}`;
        break;

      default:
        break;
    }

    const date = new Date(getParseableDate(lastDueDate?.date));

    const color = date > new Date() ? theme.palette.success.main : theme.palette.error.main;

    return { text, color };
  }, [index, lastDueDate, theme]);

  if (curDueDate) {
    return (
      <AppGridContainer>
        <Grid2 size={{ xs: 12, md: 3 }}>
          <AppCard title={`Mahnung Nr. ${index}`}>
            <Box paddingY={2}>
              <Typography variant="h6" color={label.color}>
                {label.text}
              </Typography>
            </Box>
            <MahnungField
              minDate={new Date(getParseableDate(lastDueDate?.date))}
              onValue={onPropValue('date')}
              dueDate={curDueDate}
              prop="date"
              as="date"
            />
            <MahnungField
              minDate={new Date(getParseableDate(lastDueDate?.date))}
              onValue={onPropValue('costs')}
              dueDate={curDueDate}
              prop="costs"
            />
            <MahnungField
              minDate={new Date(getParseableDate(lastDueDate?.date))}
              onValue={onPropValue('sum')}
              dueDate={curDueDate}
              prop="sum"
            />
          </AppCard>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 9 }}>
          <AppCard title="Fälligkeitsdatum immer links und rechts verändern!">
            <MahnungField onValue={onPropValue('text')} dueDate={curDueDate} prop="text" multiline />
          </AppCard>
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <PdfSaveButton onClick={() => printPaymentReminder(index)} />
        </Grid2>
      </AppGridContainer>
    );
  }

  return <AddButton disabled={createDisabled} onClick={initDueDate} />;
}

interface MahnungFieldProps {
  as?: 'date';
  dueDate: DueDate;
  prop: keyof DueDate;
  onValue: (value: any) => void;
  multiline?: true;
  minDate?: Date;
}

type Labels = {
  [path: string]: string;
};

const labels: Labels = {
  date: 'Fälligkeitsdatum der Mahnung',
  costs: 'Mahngebühr',
  sum: 'Offener Betrag aus der Rechnung',
  text: 'Text',
};

function MahnungField({ dueDate, prop, as, onValue, multiline, minDate }: Readonly<MahnungFieldProps>) {
  if (as === 'date') {
    return (
      <AppDateField minDate={minDate} value={dueDate[prop] as string} onDateChange={onValue} label={labels[prop]} />
    );
  }

  return (
    <AppTextField
      multiline={multiline}
      label={labels[prop]}
      type={'number'}
      value={dueDate[prop]}
      onChange={(ev) => onValue(ev.target.value)}
    />
  );
}

function useDueDate(index: number) {
  const rechnung = useSelector<AppState, Rechnung | undefined>((s) => s.app.current?.rechnung);
  return rechnung?.dueDates?.find((dd) => dd.index === index);
}
