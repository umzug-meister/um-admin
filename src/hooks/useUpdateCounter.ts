import { useEffect } from 'react';
import { AppCounter } from 'um-types';
import { Urls } from '../api/Urls';
import { appRequest } from '../api/fetch-client';
import { useAppServices } from './useAppServices';
import { useCurrentOrder } from './useCurrentOrder';
import { cloneDeep, set } from 'lodash';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { updateService } from '../store/servicesReducer';

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

      console.log('will update counter: ', year, month);

      let nextCounter = cloneDeep(leadCounter);

      if (!nextCounter.data?.[year]?.[month]) {
        console.log('will create new: ', year, month);
        set(nextCounter, ['data', year, month], []);
      }

      const leadsByMonth = nextCounter.data[year][month];
      const index = leadsByMonth.findIndex((l: any) => l.id === order.id);
      const nextLead = { id: order.id, src: order.src };

      if (index !== -1) {
        leadsByMonth.splice(index, 1, nextLead);
        console.log('will update lead: ', nextLead);
      } else {
        leadsByMonth.push(nextLead);
        console.log('will add lead: ', nextLead);
      }

      dispatch(updateService(nextCounter));
    }
  }, [order?.src, order?.id, order?.isCopyOf]);
}
