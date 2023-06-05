import { Box, Chip, Grid, Stack } from '@mui/material';

import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { useCurrentOrder } from '../../hooks/useCurrentOrder';
import { useSaveOrder } from '../../hooks/useSaveOrder';
import { generateRechnung } from '../../pdf/InvoicePdf';
import { AppDispatch } from '../../store';
import { updateOption } from '../../store/appReducer';
import { getPrintableDate } from '../../utils/utils';
import LeistungEdit from '../LeistungEdit';
import EmailLink from '../accounting-components/EmailLink';
import { AppCard } from './AppCard';
import { AppDateField } from './AppDateField';
import { AppGridContainer } from './AppGridContainer';
import { AppTextField } from './AppTextField';
import CalculationsView from './CalculationsView';
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

  const currentOrder = useCurrentOrder();

  const saveOrder = useSaveOrder();

  const location = useLocation();

  const onChipClick = (text: string) => {
    const date = getPrintableDate(rechnung.dueDates?.find((dd) => dd.index === 0)?.date) || '??';
    onPropChange('text', text.replace('{{date}}', date));
  };

  const isOrderEdit = location.pathname.startsWith('/edit');

  const printInvoice = () => {
    const rNumber = rechnung?.rNumber;
    if (rNumber) {
      dispatch(updateOption({ name: 'rNumber', value: rNumber }));
    }
    if (isOrderEdit && currentOrder !== null) {
      return saveOrder(currentOrder).then((order) => {
        if (order !== null) {
          return generateRechnung(rechnung);
        }
      });
    }
    generateRechnung(rechnung);
  };

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
          <CalculationsView entries={rechnung.entries} />
        </AppCard>
      </Grid>
      <Grid item xs={12}>
        <Box display="flex" flexDirection="row" gap={2}>
          <PdfSaveButton onClick={printInvoice} />
          {isOrderEdit && <EmailLink />}
        </Box>
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
