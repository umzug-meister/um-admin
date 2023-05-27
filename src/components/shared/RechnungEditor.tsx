import { Chip, Grid, Stack } from '@mui/material';

import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { useCurrentOrder } from '../../hooks/useCurrentOrder';
import { generateRechnung } from '../../pdf/InvoicePdf';
import { AppDispatch } from '../../store';
import { createUpdateOrder, updateOption } from '../../store/appReducer';
import { getPrintableDate } from '../../utils/utils';
import LeistungEdit from '../LeistungEdit';
import { AppCard } from './AppCard';
import { AppDateField } from './AppDateField';
import { AppGridContainer } from './AppGridContainer';
import { AppTextField } from './AppTextField';
import { PdfSaveButton } from './PdfSaveButton';

import { Rechnung } from 'um-types';

interface Props {
  rechnung: Rechnung;
  onPropChange(prop: keyof Rechnung, value: any): void;
}

type Labels = {
  [path: string]: string;
};

export type RechnungProp = keyof Rechnung;

export function RechnungEditor({ onPropChange, rechnung }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const order = useCurrentOrder();

  const onChipClick = useCallback(
    (text: string) => {
      const date = getPrintableDate(rechnung.dueDates?.find((dd) => dd.index === 0)?.date) || '??';
      onPropChange('text', text.replace('{{date}}', date));
    },
    [onPropChange, rechnung],
  );

  const printInvoice = useCallback(() => {
    const rNumber = rechnung?.rNumber;
    if (rNumber) {
      dispatch(updateOption({ name: 'rNumber', value: rNumber }));
    }
    if (window.location.pathname.startsWith('/edit') && order !== null) {
      return dispatch(
        createUpdateOrder({
          id: order.id,
          callback: () => generateRechnung(rechnung),
        }),
      );
    }
    generateRechnung(rechnung);
  }, [dispatch, rechnung, order]);

  return (
    <AppGridContainer>
      <Grid item xs={6}>
        <AppCard title="Kunde">
          <InvoiceField onChange={onPropChange} rechnung={rechnung} path="date" as="date" />
          <InvoiceField onChange={onPropChange} rechnung={rechnung} path="firma" />
          <InvoiceField onChange={onPropChange} rechnung={rechnung} path="customerName" />
          <InvoiceField onChange={onPropChange} rechnung={rechnung} path="customerStreet" />
          <InvoiceField onChange={onPropChange} rechnung={rechnung} path="customerPlz" />
          <InvoiceField onChange={onPropChange} rechnung={rechnung} path="rNumber" />
        </AppCard>
      </Grid>
      <Grid item xs={6}>
        <AppCard title="Text">
          <InvoiceTextTemplates setText={onChipClick} />
          <InvoiceField multiline path="text" onChange={onPropChange} rechnung={rechnung} />
        </AppCard>
      </Grid>
      <Grid item xs={12}>
        <AppCard title="Leistungen">
          <LeistungEdit
            hideChecks
            leistungen={rechnung.entries}
            update={(lst) => {
              onPropChange('entries', lst);
            }}
          />
        </AppCard>
      </Grid>
      <Grid item xs={12}>
        <PdfSaveButton onClick={printInvoice} />
      </Grid>
    </AppGridContainer>
  );
}

const labels: Labels = {
  date: 'Datum',
  firma: 'Firma',
  customerName: 'Kunde',
  customerStreet: 'Straße, Nr.',
  customerPlz: 'PLZ, Ort',
  rNumber: 'Rechnungsnummer',
};

interface InvoiceFieldProps {
  rechnung: Rechnung;
  path: RechnungProp;
  onChange(path: RechnungProp, value: any): void;
  as?: 'date';
  multiline?: true;
}

function InvoiceField({ onChange, path, rechnung, as, multiline }: InvoiceFieldProps) {
  if (as === 'date') {
    return (
      <AppDateField
        value={rechnung[path] as string}
        label={labels[path]}
        onDateChange={(value) => onChange(path, value)}
      />
    );
  }

  return (
    <AppTextField
      multiline={multiline}
      label={labels[path]}
      value={rechnung[path]}
      onChange={(ev) => onChange(path, ev.target.value)}
    />
  );
}

const CHIPS: any = {
  Bar: 'Der Rechnungsbetrag wurde bereits in Bar bezahlt.',
  Bank: 'Der Rechnungsbetrag wurde per Überweisung bezahlt.',
  'Sofort fällig': 'Die Zahlung ist sofort ohne Abzüge fällig.',
  'Bitte überweisen':
    'Bitte überweisen Sie den offenen Gesamtbetrag unter Angabe Ihrer Rechnungsnummer bis zum {{date}} (Zahlungseingang) auf unser Konto.',
  'Teil-Teil':
    'Der Teilbetrag in Höhe von ?? € wurde per Überweisung bezahlt.\nDer Teilbetrag in Höhe von ?? € wurde in Bar bezahlt.',
};

interface InvoiceTextTemplatesProps {
  setText(text: string): void;
}

function InvoiceTextTemplates({ setText }: InvoiceTextTemplatesProps) {
  return (
    <Stack direction="row" spacing={2}>
      {Object.keys(CHIPS).map((k, idx) => {
        return <Chip key={idx} label={k} onClick={() => setText(CHIPS[k])} />;
      })}
    </Stack>
  );
}
