import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import App from './App';
import AppLoader from './AppLoader';
import { store } from './store';

ReactDOM.createRoot(document.getElementById('um-configurator-admin') as HTMLElement).render(
  <Provider store={store}>
    <HashRouter>
      <AppLoader>
        <App />
      </AppLoader>
    </HashRouter>
  </Provider>,
);
