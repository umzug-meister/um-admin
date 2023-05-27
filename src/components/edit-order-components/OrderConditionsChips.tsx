import { Chip, Grid, Stack } from '@mui/material';

import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { useCurrentOrder } from '../../hooks/useCurrentOrder';
import { AppDispatch } from '../../store';
import { pushLeistung, updateOrderProps } from '../../store/appReducer';
import { AppCard } from '../shared/AppCard';

import { MLeistung, TimeBasedPrice } from 'um-types';

export function OrderConditionsChips() {
  const dispatch = useDispatch<AppDispatch>();

  const order = useCurrentOrder();

  const onClick = useCallback(
    (lst: MLeistung) => {
      dispatch(pushLeistung(lst));
    },
    [dispatch],
  );

  const removeDistance = useCallback(() => {
    dispatch(updateOrderProps({ path: ['distance'], value: undefined }));
  }, []);

  if (!order) {
    return null;
  }

  const {
    t75 = 0,
    transporterNumber = 0,
    workersNumber = 0,
    timeBased = {} as TimeBasedPrice,
    discount = '',
    rideCosts = '',
    prices,
    from,
    to,
    distance = '',
  } = order;

  return (
    <Grid item xs={12}>
      <AppCard title="Konditionen hinzufügen">
        <Stack direction="row" spacing={2}>
          <Chip
            label="Träger & LKW"
            onClick={() => {
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
                    .concat(
                      `\nMindestabnahme: ${timeBased.hours} Stunden, jede weitere Stunde: ${timeBased.extra} €/Std`,
                    );
                }
              }

              const leistung: MLeistung = {
                hidden: true,
                calculate: false,
                desc: leistungDesc,
                sum: timeBased.basis,
              };
              onClick(leistung);
            }}
          />
          <Chip
            label="Rabatt"
            onClick={() =>
              onClick({
                desc: `Rabatt  ${discount} %`,
                sum: `-${order.discountValue}`,
                calculate: false,
              })
            }
          />
          <Chip
            label="Fahrtkosten nach KM"
            onClick={() =>
              onClick({
                disabled: true,
                desc: `An/Abfahrtskosten${distance ? `: ${distance} km` : ''}`,
                sum: rideCosts,
                calculate: false,
              })
            }
          />
          <Chip
            label="Fahrtkosten manuell"
            onClick={() => {
              onClick({
                desc: `An/Abfahrtskosten${distance ? `: ${distance} km` : ''}`,
                sum: '',
                calculate: true,
              });
              removeDistance();
            }}
          />
          <Chip
            label="Halteverbotszone(n)"
            onClick={() => {
              const colli = Number(from?.parkingSlot) + Number(to?.parkingSlot);
              onClick({
                desc: `Organisation der Halteverbotszone(n)`,
                sum: prices?.halteverbotszonen?.toFixed(2) || '',
                calculate: false,
                colli,
              });
            }}
          />
          <Chip
            label="Verpackung"
            onClick={() =>
              onClick({
                desc: `Verpackung (s. Tabelle "Verpackung")\n wird nach Verbrauch berechnet`,
                sum: prices?.verpackung?.toFixed(2) || '',
                calculate: false,
              })
            }
          />
          <Chip
            label="Leistungen"
            onClick={() => {
              onClick({
                desc: `Diverse weitere Leistungen (s. Tabelle "Leistungen")`,
                sum: prices?.services?.toFixed(2) || '',
                calculate: false,
              });
            }}
          />
        </Stack>
      </AppCard>
    </Grid>
  );
}
