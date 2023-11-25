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

export const OPTIONS = {
  // included
  BASE_PRICE: 'basePrice',
  BASE_LFM: 'baseLfm',
  BASE_KM: 'baseKm',
  BASE_QM: 'baseQm',
  // extra charge in %
  CHARGE_LFM: 'chargeLfm',
  CHARGE_ETAGE04: 'chargeEtageNoLIft',
  CHARGE_ETAGELIFT: 'chargeEtageWithLift',
  // other
  LKW_PRICE: 'lkwPrice',
  KM_PRICE: 'kmPrice',
  QM_PRICE: 'qmPrice',
  HVZ_PRICE: 'hvzPrice',
  M100_PRICE: 'mHundredPrice',
  M150_PRICE: 'mHundredFiftyPrice',
  LOFT_PRICE: 'loftPrice',
  BULKY_PRICE: 'bulkyPrice',
  //disposal
  DISPOSAL_CBM: 'disposalCbmPrice',
  DISPOSAL_PAUSCHALE: 'disposalBasicPrice',
  DISPOSAL_MAX_CBM: 'disposalMaxCbm',

  BOX_CBM: 'boxCbm',
  KLEIDERBOX_CBM: 'kleiderboxCbm',
  EMAIL_FROM_NAME: 'emailFromName',
  COMPANY_EMAIL: 'companyEmail',

  A_10_METER: 'ameter',
  A_KARTON_PACK: 'aBoxPack',
  A_MONTAGE_BET: 'aBettDeMon',
  A_KITCHEN_MONTAGE: 'akitmon',
  A_WARDROBE_MONTAGE: 'awardmon',
  A_ETAGE: 'aetage',
  A_CBM: 'acbm',
  GAPIKEY: 'gapikey',
  CLIENT_ID: 'clientId',
  R_NUMBER: 'rNumber',
  G_NUMBER: 'gNumber',
  JF_API_KEY: 'jfApiKey',
  ORIGIN: 'origin',
  POOL_ID: 'poolId',
  DATA_PRIVACY_URL: 'dataPrivacyUrl',
  HOME_URL: 'homeUrl',
} as const;

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
