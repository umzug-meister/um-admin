import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Urls } from '../api/Urls';
import { appRequest } from '../api/fetch-client';
import { AppDispatch } from '../store';
import { updateService } from '../store/servicesReducer';
import { useAppServices } from './useAppServices';
import { useCurrentOrder } from './useCurrentOrder';

import { AppCounter } from '@umzug-meister/um-core';
import { set } from 'lodash';

export function useUpdateCounter() {
  const order = useCurrentOrder();
  const counters = useAppServices<AppCounter>('Counter') || [];
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (order == null || order.isCopyOf || !order.id || !order.timestamp) return;

    const leadCounter = counters.find((c) => c.type === 'Lead');
    if (leadCounter) {
      const date = new Date(order.timestamp);
      const year = String('#' + date.getFullYear());
      const month = String('#' + String(date.getMonth() + 1));

      appRequest('get')(Urls.services(leadCounter.id)).then((nextCounter) => {
        if (!nextCounter.data?.[year]?.[month]) {
          set(nextCounter, ['data', year, month], []);
        }

        const leadsByMonth = nextCounter.data[year][month];
        const index = leadsByMonth.findIndex((l: any) => l.id === order.id);
        const nextLead = { id: order.id, src: order.src };

        if (index !== -1) {
          leadsByMonth.splice(index, 1, nextLead);
        } else {
          leadsByMonth.push(nextLead);
        }

        dispatch(updateService(nextCounter));
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?.src, order?.id]);
}
