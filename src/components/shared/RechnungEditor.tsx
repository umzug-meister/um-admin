import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { Box, Button, Chip, Grid2, Stack } from '@mui/material';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { RechnungProp } from '../../app-types';
import { InvoiceEmailDialog } from '../../features/invoice/InvoiceEmailDialog';
import { useCurrentOrder } from '../../hooks/useCurrentOrder';
import { useSaveOrder } from '../../hooks/useSaveOrder';
import { generateRechnung } from '../../pdf/InvoicePdf';
import { AppDispatch } from '../../store';
import { updateOption } from '../../store/appReducer';
import { calculateNumbers, euroValue, getPrintableDate } from '../../utils/utils';
import LeistungEdit from '../LeistungEdit';
import EmailLink from '../accounting-components/EmailLink';
import { AppCard } from './AppCard';
import { AppDateField } from './AppDateField';
import { AppGridContainer } from './AppGridContainer';
import { AppTextField } from './AppTextField';
import CalculationsView from './CalculationsView';
import { PdfSaveButton } from './PdfSaveButton';

import { Rechnung } from '@umzug-meister/um-core';

interface Props {
  rechnung: Rechnung;
  onPropChange(prop: keyof Rechnung, value: any): void;
  deleteAccounting?: () => void;
  relocationDate?: string;
}

type Labels = {
  [path: string]: string;
};

export function RechnungEditor({ onPropChange, rechnung, deleteAccounting, relocationDate }: Readonly<Props>) {
  const dispatch = useDispatch<AppDispatch>();

  const currentOrder = useCurrentOrder();

  const saveOrder = useSaveOrder();

  const { pathname } = useLocation();

  const [open, setOpen] = useState(false);

  const onChipClick = (text: string) => {
    const date = getPrintableDate(rechnung.dueDates?.find((dd) => dd.index === 0)?.date) || '??';

    const { brutto: sum } = calculateNumbers(rechnung.entries);

    const paymentDate = relocationDate ? getPrintableDate(relocationDate) : '??';
    const preparedText = text
      .replace('{{date}}', date)
      .replace('{{sum}}', euroValue(sum))
      .replace('{{paymentDate}}', paymentDate);

    onPropChange('text', preparedText);
  };

  const isOrderEdit = pathname.startsWith('/edit');

  const printInvoice = () => {
    const rNumber = rechnung?.rNumber;
    if (rNumber) {
      dispatch(updateOption({ name: 'rNumber', value: rNumber }));
    }
    if (isOrderEdit && currentOrder !== null) {
      return saveOrder(currentOrder).then((order) => {
        if (order !== null) {
          return generateRechnung({ rechnung, base64: false });
        }
      });
    }
    generateRechnung({ base64: false, rechnung });
  };

  const onClearRequest = () => {
    if (window.confirm('Alle Buchhaltungsdaten (Rechnung, Mahnung(en), Gutschrift) löschen?')) {
      deleteAccounting?.();
    }
  };

  return (
    <AppGridContainer>
      <Grid2 size={6}>
        <AppCard title="Kunde">
          <InvoiceField onChange={onPropChange} rechnung={rechnung} path="firma" />
          <InvoiceField onChange={onPropChange} rechnung={rechnung} path="customerName" />
          <InvoiceField onChange={onPropChange} rechnung={rechnung} path="customerStreet" />
          <InvoiceField onChange={onPropChange} rechnung={rechnung} path="customerPlz" />
        </AppCard>
      </Grid2>
      <Grid2 size={6}>
        <AppCard title="Rechnung">
          <InvoiceField onChange={onPropChange} rechnung={rechnung} path="date" as="date" />
          <InvoiceField onChange={onPropChange} rechnung={rechnung} path="rNumber" />
          <InvoiceField onChange={onPropChange} rechnung={rechnung} path="orderId" />
        </AppCard>
      </Grid2>

      <Grid2 size={12}>
        <AppCard title="Leistungen">
          <LeistungEdit
            suggestServices
            leistungen={rechnung.entries}
            update={(lst) => {
              onPropChange('entries', lst);
            }}
          />
          <CalculationsView entries={rechnung.entries} />
        </AppCard>
      </Grid2>

      <Grid2 size={12}>
        <AppCard title="Text">
          <InvoiceTextTemplates setText={onChipClick} />
          <InvoiceField multiline path="text" onChange={onPropChange} rechnung={rechnung} />
        </AppCard>
      </Grid2>

      <Grid2 size={12}>
        <Box display="flex" flexDirection="row" gap={2}>
          <PdfSaveButton onClick={printInvoice} />

          <Button startIcon={<SendOutlinedIcon />} variant="contained" onClick={() => setOpen(true)}>
            Rechnung versenden
          </Button>

          <EmailLink />
          {deleteAccounting && (
            <Button variant="outlined" color="error" onClick={onClearRequest}>
              Löschen
            </Button>
          )}
        </Box>
        <InvoiceEmailDialog open={open} onClose={() => setOpen(false)} />
      </Grid2>
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
  orderId: 'Auftragsnummer',
};

interface InvoiceFieldProps {
  rechnung: Rechnung;
  path: RechnungProp;
  onChange(path: RechnungProp, value: any): void;
  as?: 'date';
  multiline?: true;
}

function InvoiceField({ onChange, path, rechnung, as, multiline }: Readonly<InvoiceFieldProps>) {
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
  Bar: 'Der Rechnungsbetrag in Höhe von {{sum}} wurde am {{paymentDate}} in Bar bezahlt.',
  Bank: 'Der Rechnungsbetrag in Höhe von {{sum}} wurde am ?? per Überweisung bezahlt.',
  'Sofort fällig': 'Die Zahlung ist sofort ohne Abzüge fällig.',
  'Bitte überweisen':
    'Bitte überweisen Sie den offenen Gesamtbetrag in Höhe von {{sum}} unter Angabe Ihrer Rechnungsnummer bis zum {{date}} (Zahlungseingang) auf unser Konto.',
  'Teil-Teil':
    'Der Teilbetrag in Höhe von ?? € wurde per Überweisung bezahlt.\nDer Teilbetrag in Höhe von ?? € wurde in Bar bezahlt.',
};

interface InvoiceTextTemplatesProps {
  setText(text: string): void;
}

function InvoiceTextTemplates({ setText }: Readonly<InvoiceTextTemplatesProps>) {
  return (
    <Stack direction="row" spacing={2}>
      {Object.keys(CHIPS).map((k) => {
        return <Chip key={k} label={k} onClick={() => setText(CHIPS[k])} />;
      })}
    </Stack>
  );
}
