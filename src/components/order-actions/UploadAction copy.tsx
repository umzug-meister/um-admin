import AddToDriveOutlinedIcon from '@mui/icons-material/AddToDriveOutlined';
import { Box, Breadcrumbs, Button, IconButton, Tooltip, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppServices } from '../../hooks/useAppServices';
import { useCurrentOrder } from '../../hooks/useCurrentOrder';
import { useSaveOrder } from '../../hooks/useSaveOrder';
import { generateUrzPdf } from '../../pdf/OrderPdf';
import { AppState } from '../../store';
import { AppOptions } from '../../store/appReducer';
import { AppDialog } from '../shared/AppDialog';

// import { pdfjs } from 'react-pdf';
import { AppPacking, AppService } from 'um-types';
import { addScript } from '../..';
import { useOption } from '../../hooks/useOption';
import { getByNameRegEx, listAllFoldersInFolder, listFoldersByFolderId } from './upload-action-utils';
import { orderFileName } from '../../pdf/filename';

const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';

const SCOPES = 'https://www.googleapis.com/auth/drive.file';

declare var gapi: any;
declare var google: any;

let tokenClient: any;

function gapiLoaded(gapikey: string) {
  gapi?.load('client', () => intializeGapiClient(gapikey));
}

async function intializeGapiClient(apiKey: string) {
  await gapi?.client.init({
    apiKey,
    discoveryDocs: [DISCOVERY_DOC],
  });
}

function gisLoaded(clientId: string) {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: SCOPES,
    callback: '',
  });
}

export default function UploadAction() {
  const [token, setToken] = useLocalStorage('google_token');
  const [expire, setTokenExpire] = useLocalStorage('google_token_expire');

  const [open, setOpen] = useState(false);

  const [base64, setBase64] = useState('');

  const [gPath, setGPath] = useState<string[]>([]);

  const [fileName, setFileName] = useState('');

  const currentOrder = useCurrentOrder();
  const services = useAppServices<AppService>('Bohrarbeiten');
  const packings = useAppServices<AppPacking>('Packmaterial');
  const options = useSelector<AppState, AppOptions>((s) => s.app.options);

  const gapiKey = useOption('gapikey');
  const clientId = useOption('clientId');

  const saveOrder = useSaveOrder();

  const printOrder = useCallback(() => {
    saveOrder(currentOrder).then((order) => {
      if (order !== null) {
        const orderAsBase64 = generateUrzPdf({ options, order, services: [...services, ...packings], base64: true });
        if (orderAsBase64) {
          setBase64(orderAsBase64);
        }
      }
    });
  }, [saveOrder, currentOrder, services, packings, options]);

  useEffect(() => {
    addScript('https://apis.google.com/js/api.js', true, true, () => gapiLoaded(gapiKey));
    addScript('https://accounts.google.com/gsi/client', true, true, () => gisLoaded(clientId));
  });

  useEffect(() => {
    if (currentOrder) {
      setFileName(orderFileName(currentOrder));
    }
  }, [currentOrder]);

  useEffect(() => {
    if (token !== null) {
      listAllFoldersInFolder().then((r) => {
        const rootFolder = getByNameRegEx('Umzug Test', r);
        console.log(rootFolder);
        if (rootFolder && currentOrder) {
          setGPath((p) => {
            return [...p, rootFolder.name];
          });
          const { date } = currentOrder;
          if (date) {
            const parts = date.split('.');
            const month = parts[1];
            const year = parts[2];

            listFoldersByFolderId(rootFolder.id).then((folderInRoot) => {
              const yearFolder = getByNameRegEx(`Auftrag ${year}`, folderInRoot);
              console.log(yearFolder);

              if (yearFolder) {
                setGPath((p) => {
                  return [...p, yearFolder.name];
                });
                listFoldersByFolderId(yearFolder.id).then((folderInYear) => {
                  const monthFolder = getByNameRegEx(`${month}.*${year}`, folderInYear);
                  if (monthFolder) {
                    setGPath((p) => {
                      return [...p, monthFolder.name];
                    });
                  }
                });
              }
            });
          }
        }
      });
    }
  }, [token, currentOrder]);

  const handleLoginClick = () => {
    tokenClient.callback = async (resp: any) => {
      if (resp.error !== undefined) {
        throw resp;
      } else {
        const token = gapi.client.getToken();
        setToken(token);
      }
    };

    if (gapi.client.getToken() === null) {
      // Prompt the user to select a Google Account and ask for consent to share their data
      // when establishing a new session.
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      // Skip display of account chooser and consent dialog for an existing session.
      tokenClient.requestAccessToken({ prompt: '' });
    }
  };

  const requestDialog = () => {
    setOpen(true);
    printOrder();
  };

  console.log(gPath);

  return (
    <>
      <AppDialog
        open={open}
        onRequestClose={() => {
          setOpen(false);
        }}
        title="Bei Google Drive Speichern"
      >
        <Box p={2}>
          <Typography variant="h5">Auftrag</Typography>
          <Box p={1}>
            <Typography color="primary" variant="subtitle2">
              {fileName}
            </Typography>
          </Box>
          <Typography variant="h5">Google Drive Pfad</Typography>
          <Box p={1}>
            <Breadcrumbs>
              {gPath.map((gp) => (
                <Typography>{gp}</Typography>
              ))}
            </Breadcrumbs>
          </Box>
          <Button onClick={handleLoginClick}>Anmelden</Button>
        </Box>
      </AppDialog>
      <Tooltip title="Bei Drive speichern">
        <IconButton onClick={requestDialog}>
          <AddToDriveOutlinedIcon />
        </IconButton>
      </Tooltip>
    </>
  );
}

function useLocalStorage(storageKey: string) {
  const [value, setValue] = useState(JSON.parse(localStorage.getItem(storageKey) || ''));

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(value));
  }, [value, storageKey]);

  return [value, setValue];
}
