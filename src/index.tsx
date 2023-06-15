import ReactDOM from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';

import App from './App';
import AppLoader from './AppLoader';
import reportWebVitals from './reportWebVitals';
import { store } from './store';

import styled from '@emotion/styled';

/* eslint no-extend-native: 0 */
Date.prototype.addDays = function (days: number) {
  this.setDate(this.getDate() + days);
  return this;
};

Array.prototype.from = function (index: number) {
  const newArray = [...this];
  newArray.splice(0, index);
  return newArray;
};

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

export function addScript(src: string, id: string, async?: boolean, defer?: boolean, onload?: any) {
  document.getElementById(id)?.remove();

  const script = document.createElement('script');
  script.src = src;
  script.async = async || false;
  script.defer = defer || false;
  script.onload = onload;
  script.id = id;
  document.head.appendChild(script);
}

const JOTFORM_SCRIPT = 'https://js.jotform.com/JotForm.js';

addScript(JOTFORM_SCRIPT, 'um-jf-script', true, true);

const link = document.createElement('link');
link.setAttribute('rel', 'stylesheet');
link.setAttribute('type', 'text/css');
link.setAttribute('href', 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
document.head.appendChild(link);

const ErrorFallback = styled.div`
  width: 400px;
  margin: auto;
  text-align: center;
`;

ReactDOM.createRoot(document.getElementById('um-configurator-admin') as HTMLElement).render(
  <Provider store={store}>
    <HashRouter>
      <ErrorBoundary
        fallback={
          <ErrorFallback>
            <h1>Fehler</h1>
            <h3>(´･_･`)</h3>
          </ErrorFallback>
        }
      >
        <AppLoader>
          <App />
        </AppLoader>
      </ErrorBoundary>
    </HashRouter>
  </Provider>,
);

reportWebVitals((report) => {
  console.log(`%cWEBVITAL[${report.rating}]:`, 'color:green;  font-size: 20px');
  console.log(report);
});
