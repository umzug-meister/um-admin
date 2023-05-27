import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { Outlet, Route, Routes } from 'react-router-dom';

import TopBar from './components/TopBar';
import Blanco from './routes/Blanco';
import { Categories } from './routes/Categories';
import { DirectImport } from './routes/DirectImport';
import { EMailText } from './routes/EMailText';
import { Edit } from './routes/Edit';
import { FurnitureWidget } from './routes/Furniture';
import { Options } from './routes/Options';
import Prices from './routes/Prices';
import { Services } from './routes/Services';
import Settings from './routes/Settings';
import Import from './routes/import/Import';
import Orders from './routes/order/Orders';
import Packings from './routes/packings/Packings';
import theme from './theme';

import styled from '@emotion/styled';
import 'dayjs/locale/de';

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

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppContent />}>
        <Route index element={<Orders />} />
        <Route path="edit/:id" element={<Edit />} />
        <Route path="import" element={<Import />} />
        <Route path="import/:id" element={<DirectImport />} />
        <Route path="blanco" element={<Blanco />} />
        <Route path="settings" element={<Settings />}>
          <Route index element={<Options />} />
          <Route path="prices" element={<Prices />} />
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
