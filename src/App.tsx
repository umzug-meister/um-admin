import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';

import { PropsWithChildren, Suspense, lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

import { Loading } from './components/shared/Loading';
import TopBar from './components/TopBar';
import theme from './theme';

import styled from '@emotion/styled';
import { de } from 'date-fns/locale/de';

const Blanco = lazy(() => import('./routes/Blanco'));
const Orders = lazy(() => import('./routes/Orders'));
const Packings = lazy(() => import('./routes/Packings'));
const Settings = lazy(() => import('./routes/Settings'));
const Statistics = lazy(() => import('./routes/Statistics'));
const Offers = lazy(() => import('./routes/Offers'));
const Leads = lazy(() => import('./routes/Leads'));
const Services = lazy(() => import('./routes/Services'));
const Options = lazy(() => import('./routes/Options'));
const FurnitureRoute = lazy(() => import('./routes/FurnitureRoute'));
const EMailText = lazy(() => import('./routes/EMailText'));
const Edit = lazy(() => import('./routes/Edit'));
const Categories = lazy(() => import('./routes/Categories'));
const OffersEditor = lazy(() => import('./routes/OffersEditor'));

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
  );
}

function LazyLoad({ children }: Readonly<PropsWithChildren>) {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
}

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
      <ThemeProvider theme={theme}>
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
              path="blanco"
              element={
                <LazyLoad>
                  <Blanco />
                </LazyLoad>
              }
            />

            <Route
              path="statistics"
              element={
                <LazyLoad>
                  <Statistics />
                </LazyLoad>
              }
            >
              <Route
                index
                element={
                  <LazyLoad>
                    <Leads />
                  </LazyLoad>
                }
              />
              <Route
                path="offers"
                element={
                  <LazyLoad>
                    <Offers />
                  </LazyLoad>
                }
              />
            </Route>
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
                path="offers"
                element={
                  <LazyLoad>
                    <OffersEditor />
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
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default App;
