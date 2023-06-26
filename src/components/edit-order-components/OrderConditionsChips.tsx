import { Chip, Divider, Grid, Stack } from '@mui/material';

import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { useAppServices } from '../../hooks/useAppServices';
import { useCurrentOrder } from '../../hooks/useCurrentOrder';
import { useOption } from '../../hooks/useOption';
import { AppDispatch } from '../../store';
import { pushLeistung } from '../../store/appReducer';
import { euroValue } from '../../utils/utils';
import { AppCard } from '../shared/AppCard';

import { AppPrice, MLeistung, TimeBasedPrice } from 'um-types';

export function OrderConditionsChips() {
  const dispatch = useDispatch<AppDispatch>();

  const order = useCurrentOrder();

  const kmPrice = useOption('kmPrice');

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
    t75 = 0,
    transporterNumber = 0,
    workersNumber = 0,
    timeBased = {} as TimeBasedPrice,
    discount = '',
    prices,
    from,
    to,
    distance,
  } = order;

  const isLocalMovement = from?.address?.includes('München') && to?.address?.includes('München');

  const amountOfParkingSlots = Number(from?.parkingSlot || 0) + Number(to?.parkingSlot || 0);

  const transporterAmount = Number(transporterNumber) + Number(t75);

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

  const findOffer = () => {
    return appOffers.find(
      (offer) =>
        Number(offer.t35 || 0) === Number(transporterNumber) &&
        Number(offer.includedHours || 0) === Number(workersNumber) &&
        Number(offer.t75 || 0) === Number(t75 || 0),
    );
  };

  const calculateKmPrice = () => {
    const baseKmPrice = Number(distance || 0) * Number(kmPrice || 0);

    const costs = baseKmPrice * transporterAmount;

    return Math.round(costs / 5) * 5;
  };

  const allocateRideCosts = () => {
    const offerRideCosts = findOffer()?.ridingCosts || 0;

    if (isLocalMovement) {
      return offerRideCosts;
    }

    const kmRideCosts = calculateKmPrice();

    return Math.max(offerRideCosts, kmRideCosts);
  };

  const createRideCostsLst = (): MLeistung => {
    return {
      desc: transporterAmount > 1 ? `An/Abfhartskosten ${transporterAmount} x LKW` : 'An/Abfahrtskosten',
      sum: allocateRideCosts(),
      calculate: true,
    };
  };

  const createParkingSlotsLst = (): MLeistung => {
    return {
      desc: `Organisation der Halteverbotszone(n)`,
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

  const rideCostsLabel = isLocalMovement ? (
    <p>
      Fahrtkosten in <b>München</b>
    </p>
  ) : (
    <p>Fahrtkosten {distance ? <b>{distance} km</b> : ''}</p>
  );

  return (
    <Grid item xs={12}>
      <AppCard title="Konditionen hinzufügen">
        <Stack direction="row" spacing={3} divider={<Divider orientation="vertical" flexItem />}>
          <Chip label="Alle Leistungen" color="primary" onClick={onAllRequest} />
          <Stack direction="row" spacing={2}>
            <Chip label="Träger & LKW" onClick={onPushRequest(createWorkerLst())} />
            <Chip
              label={<p>Rabatt {<b>{euroValue(order.discountValue || 0)}</b>}</p>}
              onClick={onPushRequest(createDiscountLst())}
            />
            <Chip label={rideCostsLabel} onClick={onPushRequest(createRideCostsLst())} />
            <Chip
              label={
                <p>
                  <b>{amountOfParkingSlots}</b> Halteverbotszone(n)
                </p>
              }
              onClick={onPushRequest(createParkingSlotsLst())}
            />
            <Chip
              label={<p>Verpackung {<b>{euroValue(prices.verpackung)}</b>}</p>}
              onClick={onPushRequest(createPackingLst())}
            />
            <Chip
              onClick={onPushRequest(createServicesLst())}
              label={<p>Leistungen {<b>{euroValue(prices.services)}</b>}</p>}
            />
          </Stack>
        </Stack>
      </AppCard>
    </Grid>
  );
}
