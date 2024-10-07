import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { RechnungProp } from '../../app-types';
import { useCurrentOrder } from '../../hooks/useCurrentOrder';
import { AppDispatch } from '../../store';
import { initInvoice, updateOrderProps } from '../../store/appReducer';
import AddButton from '../shared/AddButton';
import { RechnungEditor } from '../shared/RechnungEditor';

export function Rechnung() {
  const order = useCurrentOrder();

  const dispatch = useDispatch<AppDispatch>();

  const onPropChange = useCallback(
    (prop: RechnungProp, value: any) => {
      dispatch(updateOrderProps({ path: ['rechnung', prop], value }));
    },
    [dispatch],
  );

  const deleteAccounting = useCallback(() => {
    dispatch(updateOrderProps({ path: ['rechnung'], value: undefined }));
    dispatch(updateOrderProps({ path: ['gutschrift'], value: undefined }));
  }, [dispatch]);

  const onInitrechnung = useCallback(() => {
    dispatch(initInvoice());
  }, [dispatch]);

  if (order?.rechnung) {
    return (
      <RechnungEditor
        rechnung={order.rechnung}
        onPropChange={onPropChange}
        deleteAccounting={deleteAccounting}
        relocationDate={order.date}
      />
    );
  }

  return <AddButton onClick={onInitrechnung} />;
}
