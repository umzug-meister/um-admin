import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { appRequest } from '../api';
import { Urls } from '../api/Urls';
import { AppDispatch } from '../store';
import { setUnsavedChanges } from '../store/appReducer';

import { Order } from 'um-types';

type SaveOrderHook = () => (order: Order | null) => Promise<Order | null>;

export const useSaveOrder: SaveOrderHook = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const errorHandler = (err: any) => {
    alert('Speichern nicht möglich');
    console.error(err);
    return null;
  };

  const createUpdateOrder = useCallback(
    (order: Order | null): Promise<Order | null> => {
      if (!order) {
        return Promise.resolve(null);
      }

      if (order.id) {
        return appRequest('put')(Urls.orderById(order.id), order)
          .then((res: Order) => {
            dispatch(setUnsavedChanges({ unsavedChanges: false }));
            return res;
          })
          .catch(errorHandler);
      } else {
        return appRequest('post')(Urls.orderById(), order)
          .then((res) => {
            navigate(`/edit/${res.id}`);
            return res;
          })
          .catch(errorHandler);
      }
    },
    [dispatch, navigate],
  );

  return createUpdateOrder;
};
