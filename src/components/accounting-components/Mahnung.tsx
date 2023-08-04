import { Grid } from '@mui/material';

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useCurrentOrder } from '../../hooks/useCurrentOrder';
import { useSaveOrder } from '../../hooks/useSaveOrder';
import { generatePaymentReminder } from '../../pdf/PaymentReminderPdf';
import { AppDispatch, AppState } from '../../store';
import { updateOrderProps } from '../../store/appReducer';
import { createDueDate } from '../../utils/utils';
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

export function Mahnung({ index }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const currentOrder = useCurrentOrder();

  const saveOrder = useSaveOrder();

  const curDueDate = useDueDate(index);
  const prevDueDate = useDueDate(index - 1);

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
    const dueDate = createDueDate(index);

    dispatch(
      updateOrderProps({
        path: ['rechnung', 'dueDates'],
        value: [...(rechnung?.dueDates || []), dueDate],
      }),
    );
  }, [dispatch, rechnung, index]);

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

  if (curDueDate) {
    return (
      <AppGridContainer>
        <Grid item xs={6} xl={3}>
          <AppCard title={`Mahnung Nr. ${index}`}>
            <AppTextField value={prevDueDate?.date} disabled label="Fälligkeit" />
            <MahnungField onValue={onPropValue('date')} dueDate={curDueDate} prop="date" as="date" />
            <MahnungField onValue={onPropValue('costs')} dueDate={curDueDate} prop="costs" />
          </AppCard>
        </Grid>
        <Grid item xs={12}>
          <PdfSaveButton onClick={() => printPaymentReminder(index)} />
        </Grid>
      </AppGridContainer>
    );
  }

  return <AddButton disabled={!prevDueDate} onClick={initDueDate} />;
}

interface MahnungFieldProps {
  as?: 'date';
  dueDate: DueDate;
  prop: keyof DueDate;
  onValue: (value: any) => void;
}

type Labels = {
  [path: string]: string;
};

const labels: Labels = {
  date: 'Zu bezahlen bis',
  costs: 'Mahngebühr',
};

function MahnungField({ dueDate, prop, as, onValue }: MahnungFieldProps) {
  if (as === 'date') {
    return <AppDateField value={dueDate[prop] as string} onDateChange={onValue} label={labels[prop]} />;
  }

  return (
    <AppTextField
      label={labels[prop]}
      type={'number'}
      value={dueDate[prop]}
      onChange={(ev) => onValue(ev.target.value)}
    />
  );
}

export function useDueDate(index: number) {
  const rechnung = useSelector<AppState, Rechnung | undefined>((s) => s.app.current?.rechnung);
  return rechnung?.dueDates?.find((dd) => dd.index === index);
}
