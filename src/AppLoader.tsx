import { PropsWithChildren, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { AppDispatch } from './store';
import { loadAllOptions } from './store/appReducer';
import { loadAllCategories } from './store/categoriesReducer';
import { loadAllFurniture } from './store/furnitureReducer';
import { loadAllServices } from './store/servicesReducer';

export default function AppLoader({ children }: PropsWithChildren) {
  const [init, setInit] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    Promise.all([
      dispatch(loadAllOptions()),
      dispatch(loadAllCategories()),
      dispatch(loadAllFurniture()),
      dispatch(loadAllServices()),
    ]).then(() => {
      setInit(true);
    });
  }, [dispatch]);

  if (init) {
    return <>{children}</>;
  }
  return null;
}
