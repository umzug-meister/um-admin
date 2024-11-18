import { Alert, Snackbar } from '@mui/material';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppState } from '../../store';
import { AppNotification, removeAllNotifications } from '../../store/notificationReducer';

export const NotificationSnackbar = () => {
  const dispatch = useDispatch();
  const notifications = useSelector<AppState, AppNotification[]>((state) => state.notifications);

  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        dispatch(removeAllNotifications());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notifications, dispatch]);

  return (
    <>
      {notifications.map(({ message, severity }) => (
        <Snackbar key={message} open={true} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert variant="filled" severity={severity}>
            {message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};
