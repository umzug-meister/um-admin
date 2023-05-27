import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { Suspense, lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

import { Fallback } from './components/Fallback';
import TopBar from './components/TopBar';
import theme from './theme';

import styled from '@emotion/styled';
import 'dayjs/locale/de';

const Import = lazy(() => import('./routes/import/Import'));
const Prices = lazy(() => import('./routes/Prices'));
const Blanco = lazy(() => import('./routes/Blanco'));
const Orders = lazy(() => import('./routes/Orders'));
const Packings = lazy(() => import('./routes/packings/Packings'));
const Settings = lazy(() => import('./routes/Settings'));
const Services = lazy(() => import('./routes/Services'));
const Options = lazy(() => import('./routes/Options'));
const FurnitureRoute = lazy(() => import('./routes/FurnitureRoute'));
const EMailText = lazy(() => import('./routes/EMailText'));
const DirectImport = lazy(() => import('./routes/DirectImport'));
const Edit = lazy(() => import('./routes/Edit'));
const Categories = lazy(() => import('./routes/Categories'));

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
        <Route
          path="edit/:id"
          element={
            <LazyLoad>
              <Edit />
            </LazyLoad>
          }
        />
        <Route
          path="import"
          element={
            <LazyLoad>
              <Import />
            </LazyLoad>
          }
        />
        <Route
          path="import/:id"
          element={
            <LazyLoad>
              <DirectImport />
            </LazyLoad>
          }
        />
        <Route
          path="blanco"
          element={
            <LazyLoad>
              <Blanco />
            </LazyLoad>
          }
        />
        <Route
          path="settings"
          element={
            <LazyLoad>
              <Settings />
            </LazyLoad>
          }
        >
          <Route
            index
            element={
              <LazyLoad>
                <Options />
              </LazyLoad>
            }
          />
          <Route
            path="prices"
            element={
              <LazyLoad>
                <Prices />
              </LazyLoad>
            }
          />
          <Route
            path="packings"
            element={
              <LazyLoad>
                <Packings />
              </LazyLoad>
            }
          />
          <Route
            path="services"
            element={
              <LazyLoad>
                <Services />
              </LazyLoad>
            }
          />
          <Route
            path="categories"
            element={
              <LazyLoad>
                <Categories />
              </LazyLoad>
            }
          />
          <Route
            path="furniture"
            element={
              <LazyLoad>
                <FurnitureRoute />
              </LazyLoad>
            }
          />
        </Route>
      </Route>
      <Route
        path="email-text"
        element={
          <LazyLoad>
            <EMailText />
          </LazyLoad>
        }
      />
    </Routes>
  );
}

export default App;
