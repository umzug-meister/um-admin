import { appReducer } from './appReducer';
import { categoriesReducer } from './categoriesReducer';
import { furnitureReducer } from './furnitureReducer';
import { servicesReducer } from './servicesReducer';

import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    services: servicesReducer,
    categories: categoriesReducer,
    furniture: furnitureReducer,
    app: appReducer,
  },
});

export type AppDispatch = typeof store.dispatch;

export type AppState = ReturnType<typeof store.getState>;
