import { appReducer } from './appReducer';
import { categoriesReducer } from './categoriesReducer';
import { furnitureReducer } from './furnitureReducer';
import { notificationsReducer } from './notificationReducer';
import { searchReducer } from './searchReducer';
import { servicesReducer } from './servicesReducer';

import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    services: servicesReducer,
    categories: categoriesReducer,
    furniture: furnitureReducer,
    app: appReducer,
    search: searchReducer,
    notifications: notificationsReducer,
  },
});

export { store };

export type AppDispatch = typeof store.dispatch;

export type AppState = ReturnType<typeof store.getState>;
