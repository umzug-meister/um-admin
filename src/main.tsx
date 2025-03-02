import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';

import App from './App';
import AppLoader from './AppLoader';
import './index.css';
import { store } from './store';

import '@fontsource/roboto';

createRoot(document.getElementById('um-configurator-admin') as HTMLElement).render(
  <Provider store={store}>
    <HashRouter>
      <AppLoader>
        <App />
      </AppLoader>
    </HashRouter>
  </Provider>,
);
