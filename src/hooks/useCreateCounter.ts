import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { createAppService } from '../store/servicesReducer';
import { useAppServices } from './useAppServices';
import { AppCounter, AppCounterType } from 'um-types';
import { appRequest } from '../api/fetch-client';
import { Urls } from '../api/Urls';

export function useCreateCounter() {
  const services = useAppServices<AppCounter>('Counter') || [];

  useEffect(() => {
    if (services.findIndex((s) => s.type === 'Lead') === -1) {
      checkCreateCounter({ type: 'Lead' });
    }

    if (services.findIndex((s) => s.type === 'Offer') === -1) {
      checkCreateCounter({ type: 'Offer' });
    }
  }, [services]);
}

type CheckCreateCounterParam = {
  type: AppCounterType;
};

async function checkCreateCounter({ type }: CheckCreateCounterParam) {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  console.log('init counter: ', type);
  const counter = { tag: 'Counter', type: type, data: { [String(year)]: { [String(month)]: [] } } };
  await appRequest('post')(Urls.services(''), counter);
}
