import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';

import App from './App';
import AppLoader from './AppLoader';
import reportWebVitals from './reportWebVitals';
import { store } from './store';

export function addScript(src: string, async?: boolean, defer?: boolean, onload?: any) {
  const script = document.createElement('script');
  script.src = src;
  script.async = async || false;
  script.defer = defer || false;
  script.onload = onload;
  document.head.appendChild(script);
}

const JOTFORM_SCRIPT = 'https://js.jotform.com/JotForm.js';

// eslint-disable-next-line no-extend-native
Date.prototype.addDays = function (days: number) {
  this.setDate(this.getDate() + days);
  return this;
};

// eslint-disable-next-line no-extend-native
Array.prototype.from = function (index: number) {
  const newArray = [...this];
  newArray.splice(0, index);
  return newArray;
};

addScript(JOTFORM_SCRIPT, true, true);

const link = document.createElement('link');
link.setAttribute('rel', 'stylesheet');
link.setAttribute('type', 'text/css');
link.setAttribute('href', 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
document.head.appendChild(link);

ReactDOM.createRoot(document.getElementById('um-configurator-admin') as HTMLElement).render(
  <Provider store={store}>
    <HashRouter>
      <AppLoader>
        <App />
      </AppLoader>
    </HashRouter>
  </Provider>,
);

reportWebVitals((report) => {
  console.log(`%cWEBVITAL[${report.rating}]:`, 'color:green;  font-size: 20px');
  console.log(report);
});
