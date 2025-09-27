import { Chip, Divider, Grid2, Stack } from '@mui/material';

import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { useAppServices } from '../../../hooks/useAppServices';
import { useCurrentOrder } from '../../../hooks/useCurrentOrder';
import { useOption } from '../../../hooks/useOption';
import { AppDispatch } from '../../../store';
import { pushLeistung } from '../../../store/appReducer';
import { euroValue, getParkingsSlotsAmount, isLocalMovement } from '../../../utils/utils';
import { AppCard } from '../../shared/AppCard';
import { calculateRideCostsByKm } from './orderConditionsChipsCalcFunctions';

import { AppPrice, MLeistung, TimeBasedPrice } from '@umzug-meister/um-core';

const MAX_CBM_LOOKUP = {
  '2': {
    '2': '4-6',
    '3': '6-8',
    '4': '8-10',
  },
  '3': {
    '4': '10-13',
  },
} as any;

export function OrderConditionsChips() {
  const dispatch = useDispatch<AppDispatch>();

  const order = useCurrentOrder();

  const kmPrice = useOption('kmPrice');
  const hvzPrice = useOption('hvzPrice');

  const appOffers = useAppServices<AppPrice>('Price');

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
    transporterNumber = 0,
    workersNumber = 0,
    timeBased = {} as TimeBasedPrice,
    discount = '',
    prices,
    from,
    to,
    secondaryFrom,
    secondaryTo,
    distance,
  } = order;

  const localMovement = isLocalMovement([from, to, secondaryFrom, secondaryTo]);

  const amountOfParkingSlots = getParkingsSlotsAmount([from, to, secondaryFrom, secondaryTo]);

  const transporterAmount = Number(transporterNumber);

  const createWorkerLst = () => {
    const workerDescriptionList = [`${workersNumber} Träger`];

    if (transporterNumber > 0) {
      workerDescriptionList.push(`/ ${transporterNumber} x LKW 3,5t`);
    }

    if (timeBased?.hours) {
      const curDesc = `\nMindestabnahme: ${timeBased.hours} Stunden, jede weitere Stunde: ${timeBased.extra} €/Std`;
      workerDescriptionList.push(curDesc);
      if (Number(timeBased.hours) <= 4) {
        workerDescriptionList.push(`\nMaximale Abnahme: ${Number(timeBased.hours) + 1} Stunden`);
        const maxCbm = MAX_CBM_LOOKUP[workersNumber]?.[timeBased.hours];
        if (maxCbm) {
          workerDescriptionList.push(`\nMaximales Umzugsgutvolumen: ${maxCbm} m³`);
        }
      }
    }

    const leistung: MLeistung = {
      hidden: true,
      calculate: false,
      desc: workerDescriptionList.join(' '),
      sum: timeBased.basis,
    };
    return leistung;
  };

  const createDiscountLst = (): MLeistung => {
    return {
      desc: `Rabatt ${discount} %`,
      sum: `-${order.discountValue}`,
      calculate: false,
      red: true,
    };
  };

  const findOffer = () => {
    return appOffers.find(
      (appOffer) =>
        Number(appOffer.t35 || 0) === Number(transporterNumber) &&
        Number(appOffer.includedHours || 0) === Number(timeBased.hours),
    );
  };

  const allocateRideCosts = () => {
    const offerRideCosts = findOffer()?.ridingCosts || 0;
    if (localMovement) {
      return offerRideCosts;
    }
    const kmRideCosts = calculateRideCostsByKm({
      distance,
      kmPrice,
      transporterAmount,
    });
    return Math.max(offerRideCosts, kmRideCosts);
  };

  const createRideCostsLst = (): MLeistung => {
    return {
      desc: transporterAmount > 1 ? `An/Abfahrtskosten ${transporterAmount} x LKW` : 'An/Abfahrtskosten',
      sum: allocateRideCosts(),
      calculate: true,
    };
  };

  const createParkingSlotsLst = (): MLeistung => {
    return {
      desc: `Organisation der Halteverbotszone(n)`,
      price: hvzPrice,
      sum: prices?.halteverbotszonen?.toFixed(2) || '',
      calculate: false,
      colli: amountOfParkingSlots,
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
      createRideCostsLst(),
      createParkingSlotsLst(),
      createPackingLst(),
      createServicesLst(),
    ];
    leistungen.forEach((leistung) => {
      dispatch(pushLeistung(leistung));
    });
  };

  return (
    <Grid2 size={12}>
      <AppCard title="Konditionen hinzufügen">
        <Stack direction="row" spacing={3} divider={<Divider orientation="vertical" flexItem />}>
          <Chip label="Alle Leistungen" color="primary" onClick={onAllRequest} />
          <Stack direction="row" spacing={2}>
            <Chip label="Träger & LKW" onClick={onPushRequest(createWorkerLst())} />
            <Chip
              label={<p>Rabatt {<b>{euroValue(order.discountValue || 0)}</b>}</p>}
              onClick={onPushRequest(createDiscountLst())}
            />
            <Chip
              label={<RideCostsLabel distance={distance} isLocalMovement={localMovement} />}
              onClick={onPushRequest(createRideCostsLst())}
            />
            <Chip
              label={
                <p>
                  <b>{amountOfParkingSlots}</b> Halteverbotszone(n)
                </p>
              }
              onClick={onPushRequest(createParkingSlotsLst())}
            />
            <Chip
              label={<p>Verpackung {<b>{euroValue(prices?.verpackung)}</b>}</p>}
              onClick={onPushRequest(createPackingLst())}
            />
            <Chip
              onClick={onPushRequest(createServicesLst())}
              label={<p>Leistungen {<b>{euroValue(prices?.services)}</b>}</p>}
            />
          </Stack>
        </Stack>
      </AppCard>
    </Grid2>
  );
}

function RideCostsLabel({ isLocalMovement, distance }: { distance: number; isLocalMovement: boolean }) {
  return isLocalMovement ? (
    <p>
      Fahrtkosten in <b>München</b>
    </p>
  ) : (
    <p>Fahrtkosten {distance ? <b>{distance} km</b> : ''}</p>
  );
}
