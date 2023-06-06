import { Chip, Grid, Stack } from '@mui/material';

import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { useCurrentOrder } from '../../hooks/useCurrentOrder';
import { AppDispatch } from '../../store';
import { pushLeistung } from '../../store/appReducer';
import { AppCard } from '../shared/AppCard';

import { MLeistung, TimeBasedPrice } from 'um-types';

export function OrderConditionsChips() {
  const dispatch = useDispatch<AppDispatch>();

  const order = useCurrentOrder();

  const onPushRequest = useCallback(
    (lst: MLeistung) => {
      return function () {
        dispatch(pushLeistung(lst));
      };
    },
    [dispatch],
  );

  if (!order) {
    return null;
  }

  const {
    t75 = 0,
    transporterNumber = 0,
    workersNumber = 0,
    timeBased = {} as TimeBasedPrice,
    discount = '',
    prices,
    from,
    to,
    distance = '',
  } = order;

  const createWorkerLst = () => {
    let leistungDesc = `${workersNumber} Träger `;
    if (transporterNumber > 0) {
      leistungDesc = leistungDesc.concat(` / ${transporterNumber} x LKW 3.5t`);
    }
    if (t75) {
      leistungDesc = leistungDesc.concat(` / ${t75} x LKW 7.5t`);
    }
    if (timeBased) {
      if (timeBased.hours) {
        leistungDesc = leistungDesc
          .concat(' ')
          .concat(`\nMindestabnahme: ${timeBased.hours} Stunden, jede weitere Stunde: ${timeBased.extra} €/Std`);
      }
    }

    const leistung: MLeistung = {
      hidden: true,
      calculate: false,
      desc: leistungDesc,
      sum: timeBased.basis,
    };
    return leistung;
  };

  const createDiscountLst = (): MLeistung => {
    return {
      desc: `Rabatt  ${discount} %`,
      sum: `-${order.discountValue}`,
      calculate: false,
      red: true,
    };
  };

  const createRideCostsLst = (): MLeistung => {
    return {
      desc: 'An/Abfahrtskosten',
      sum: '',
      calculate: true,
    };
  };

  const createParkingSlotsLst = (): MLeistung => {
    const colli = Number(from?.parkingSlot) + Number(to?.parkingSlot);
    return {
      desc: `Organisation der Halteverbotszone(n)`,
      sum: prices?.halteverbotszonen?.toFixed(2) || '',
      calculate: false,
      colli,
    };
  };

  const createPackingLst = (): MLeistung => {
    return {
      desc: `Verpackung (s. Tabelle "Verpackung")\n wird nach Verbrauch berechnet`,
      sum: prices?.verpackung?.toFixed(2) || '',
      calculate: false,
    };
  };

  const createServicesLst = (): MLeistung => {
    return {
      desc: `Diverse weitere Leistungen (s. Tabelle "Leistungen")`,
      sum: prices?.services?.toFixed(2) || '',
      calculate: false,
    };
  };

  const onAllRequest = () => {
    const leistungen = [
      createWorkerLst(),
      createDiscountLst(),
      createParkingSlotsLst(),
      createPackingLst(),
      createServicesLst(),
    ];
    leistungen.forEach((leistung) => {
      dispatch(pushLeistung(leistung));
    });
  };

  return (
    <Grid item xs={12}>
      <AppCard title="Konditionen hinzufügen">
        <Stack direction="row" spacing={2}>
          <Chip label="Alle Leistungen" color="primary" onClick={onAllRequest} />
          <Chip label="Träger & LKW" onClick={onPushRequest(createWorkerLst())} />
          <Chip label="Rabatt" onClick={onPushRequest(createDiscountLst())} />
          <Chip
            label={`Fahrtkosten ${distance ? `${distance} km` : ''}`}
            onClick={onPushRequest(createRideCostsLst())}
          />
          <Chip label="Halteverbotszone(n)" onClick={onPushRequest(createParkingSlotsLst())} />
          <Chip label="Verpackung" onClick={onPushRequest(createPackingLst())} />
          <Chip label="Leistungen" onClick={onPushRequest(createServicesLst())} />
        </Stack>
      </AppCard>
    </Grid>
  );
}
