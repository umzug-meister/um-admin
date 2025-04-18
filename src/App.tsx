import { Box, CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { PropsWithChildren, Suspense, lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

import TopBar from './components/TopBar';
import { Loading } from './components/shared/Loading';
import { NotificationSnackbar } from './features/notifications/NotificationsSnackbar';
import { darkTheme, lightTheme } from './theme';

import styled from '@emotion/styled';
import { de } from 'date-fns/locale/de';

const Blanco = lazy(() => import('./routes/Blanco'));
const Orders = lazy(() => import('./routes/Orders'));
const Packings = lazy(() => import('./routes/Packings'));
const Settings = lazy(() => import('./routes/Settings'));
const Leads = lazy(() => import('./routes/Leads'));
const Services = lazy(() => import('./routes/Services'));
const Options = lazy(() => import('./routes/Options'));
const FurnitureRoute = lazy(() => import('./routes/FurnitureRoute'));
const EMailText = lazy(() => import('./features/email/routes/EMailText'));
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
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = prefersDarkMode ? darkTheme : lightTheme;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
      <NotificationSnackbar />

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
                  <Leads />
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
