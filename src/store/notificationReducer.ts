import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type AppNotification = {
  message: string;
  severity: 'success' | 'error' | 'info';
};
const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: new Array<AppNotification>(),
  reducers: {
    addNotification: (state, action: PayloadAction<AppNotification>) => {
      state.push(action.payload);
    },
    removeAllNotifications: () => {
      return [];
    },
  },
});

const notificationsReducer = notificationsSlice.reducer;
export const { addNotification, removeAllNotifications } = notificationsSlice.actions;

export { notificationsReducer };
