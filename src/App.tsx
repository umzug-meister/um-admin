import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { Suspense, lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

import { Fallback } from './components/Fallback';
import TopBar from './components/TopBar';
// import Blanco from './routes/Blanco';
import { Categories } from './routes/Categories';
import { DirectImport } from './routes/DirectImport';
import { EMailText } from './routes/EMailText';
import { Edit } from './routes/Edit';
import { FurnitureWidget } from './routes/Furniture';
import { Options } from './routes/Options';
// import Prices from './routes/Prices';
import { Services } from './routes/Services';
import Settings from './routes/Settings';
import Import from './routes/import/Import';
// import Orders from './routes/order/Orders';
import Packings from './routes/packings/Packings';
import theme from './theme';

import styled from '@emotion/styled';
import 'dayjs/locale/de';

const Prices = lazy(() => import('./routes/Prices'));
const Blanco = lazy(() => import('./routes/Blanco'));
const Orders = lazy(() => import('./routes/Orders'));

const AppDiv = styled.div`
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
  display: flex;
  position: relative;
`;

const ContentMain = styled.main`
  flex-grow: 1;
`;

function AppContent() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'de'}>
      <ThemeProvider theme={theme}>
        <>
          <CssBaseline />
          <AppDiv>
            <ContentMain>
              <TopBar />
              <Box mt={10}>
                <Outlet />
              </Box>
            </ContentMain>
          </AppDiv>
        </>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

function LazyLoad({ children }: React.PropsWithChildren) {
  return <Suspense fallback={<Fallback />}>{children}</Suspense>;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppContent />}>
        <Route
          index
          element={
            <LazyLoad>
              <Orders />
            </LazyLoad>
          }
        />
        <Route path="edit/:id" element={<Edit />} />
        <Route path="import" element={<Import />} />
        <Route path="import/:id" element={<DirectImport />} />
        <Route
          path="blanco"
          element={
            <LazyLoad>
              <Blanco />
            </LazyLoad>
          }
        />
        <Route path="settings" element={<Settings />}>
          <Route index element={<Options />} />
          <Route
            path="prices"
            element={
              <LazyLoad>
                <Prices />
              </LazyLoad>
            }
          />
          <Route path="packings" element={<Packings />} />
          <Route path="services" element={<Services />} />
          <Route path="categories" element={<Categories />} />
          <Route path="furniture" element={<FurnitureWidget />} />
        </Route>
      </Route>
      <Route path="email-text" element={<EMailText />} />
    </Routes>
  );
}

export default App;
