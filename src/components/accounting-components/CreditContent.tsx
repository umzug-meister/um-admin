import { Grid2 } from '@mui/material';

import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { useCurrentOrder } from '../../hooks/useCurrentOrder';
import { useSaveOrder } from '../../hooks/useSaveOrder';
import { generateGutschrift } from '../../pdf/CreditPdf';
import { AppDispatch } from '../../store';
import { initCredit, updateOrderProps } from '../../store/appReducer';
import LeistungEdit from '../LeistungEdit';
import AddButton from '../shared/AddButton';
import { AppCard } from '../shared/AppCard';
import { AppDateField } from '../shared/AppDateField';
import { AppGridContainer } from '../shared/AppGridContainer';
import { AppTextField } from '../shared/AppTextField';
import CalculationsView from '../shared/CalculationsView';
import { PdfSaveButton } from '../shared/PdfSaveButton';

import { Gutschrift } from 'um-types';

type GutschriftProp = keyof Gutschrift;

export function CreditContent() {
  const order = useCurrentOrder();

  const saveOrder = useSaveOrder();
  const dispatch = useDispatch<AppDispatch>();

  const printCredit = useCallback(() => {
    const rechnung = order?.rechnung;
    const gutschrift = order?.gutschrift;

    if (rechnung && gutschrift) {
      saveOrder(order).then((order) => {
        if (order) {
          generateGutschrift({ gutschrift, rechnung });
        }
      });
    }
  }, [order, saveOrder]);

  const initGutschrift = useCallback(() => {
    dispatch(initCredit());
  }, [dispatch]);

  const onPropChange = useCallback(
    (prop: GutschriftProp, value: any) => {
      dispatch(updateOrderProps({ path: ['gutschrift', prop], value }));
    },
    [dispatch],
  );
  if (order == null) {
    return null;
  }

  const { gutschrift, rechnung } = order;

  if (typeof gutschrift === 'undefined') {
    return <AddButton onClick={initGutschrift} />;
  }

  return (
    <AppGridContainer>
      <Grid2 size={{ xs: 6, xl: 4 }}>
        <AppCard title="Kunde">
          <AppTextField label="Kunde" value={rechnung?.customerName} disabled />
          <AppTextField label="Strasse, Nr." value={rechnung?.customerStreet} disabled />
          <AppTextField label="PLZ, Ort" value={rechnung?.customerPlz} disabled />
          <GutschriftField
            label="Datum"
            value={gutschrift.date}
            as="date"
            onValue={(value) => onPropChange('date', value)}
          />
          <GutschriftField
            label="Gutschrift Nummer"
            value={gutschrift.gNumber}
            onValue={(value) => onPropChange('gNumber', value)}
          />
        </AppCard>
      </Grid2>

      <Grid2 size={{ xs: 6, xl: 4 }}>
        <AppCard title="Text">
          <GutschriftField value={gutschrift.text} multiline onValue={(value) => onPropChange('text', value)} />
        </AppCard>
      </Grid2>
      <Grid2 size={{ xs: 12, xl: 8 }}>
        <AppCard title="Leistungen">
          <LeistungEdit
            hideChecks
            leistungen={gutschrift.entries}
            update={(lst) => {
              onPropChange('entries', lst);
            }}
          />
          <CalculationsView entries={gutschrift.entries} />
        </AppCard>
      </Grid2>
      <Grid2 size={{ xs: 12, xl: 6 }}>
        <PdfSaveButton onClick={printCredit} />
      </Grid2>
    </AppGridContainer>
  );
}

interface GutschriftFieldProps {
  onValue(value: any): void;
  as?: 'date';
  multiline?: true;
  value: any;
  label?: string;
}

function GutschriftField({ value, onValue, multiline, label, as }: Readonly<GutschriftFieldProps>) {
  if (as === 'date') {
    return <AppDateField label={label} value={value} onDateChange={onValue} />;
  }
  return <AppTextField label={label} multiline={multiline} value={value} onChange={(ev) => onValue(ev.target.value)} />;
}
