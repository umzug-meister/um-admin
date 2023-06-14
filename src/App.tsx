import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { Suspense, lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

import { Fallback } from './components/Fallback';
import TopBar from './components/TopBar';
import theme from './theme';

import styled from '@emotion/styled';
import de from 'date-fns/locale/de';

const Import = lazy(() => import('./routes/Import'));
const Prices = lazy(() => import('./routes/Prices'));
const Blanco = lazy(() => import('./routes/Blanco'));
const Orders = lazy(() => import('./routes/Orders'));
const Packings = lazy(() => import('./routes/Packings'));
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
  display: flex;
  position: relative;
`;

const ContentMain = styled.main`
  flex-grow: 1;
`;

function AppContent() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
      <ThemeProvider theme={theme}>
        <>
          <CssBaseline />
          <AppDiv>
            <ContentMain>
              <TopBar />
              <Box mt={7}>
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
        path="email-text/:id"
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
