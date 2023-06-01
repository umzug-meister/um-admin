import BackupOutlinedIcon from '@mui/icons-material/BackupOutlined';
import { Box, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { addScript } from '../..';
import { AppCard } from '../../components/shared/AppCard';
import { AppTextField } from '../../components/shared/AppTextField';
import { useOption } from '../../hooks/useOption';
import { getPath } from './upload-action-utils';

const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';

const SCOPES = 'https://www.googleapis.com/auth/drive.file';

declare var gapi: any;
declare var google: any;
let tokenClient: any;

interface Props {
  initFileName: string;
  date: string | undefined;
}

export function DriveUploadView({ initFileName, date }: Props) {
  const [token, setToken] = useLocalStorage('google_token');
  const [expire, setTokenExpire] = useLocalStorage('google_token_expire');

  const gapiKey = useOption('gapikey');
  const clientId = useOption('clientId');

  const [fileName, setFileName] = useState(initFileName);
  const [path, setPath] = useState<string[]>([]);

  const [gapiLoaded, setGapiLoaded] = useState(false);
  const [clientLoaded, setClientloaded] = useState(false);
  const [tokenAvailable, setTokenAvailable] = useState(false);

  useEffect(() => {
    if (gapiKey) {
      addScript('https://apis.google.com/js/api.js', true, true, function () {
        gapi.load('client', function () {
          gapi.client
            .init({
              apiKey: gapiKey,
              discoveryDocs: [DISCOVERY_DOC],
            })
            .then(() => {
              setGapiLoaded(true);
            });
        });
      });
    }
  }, [gapiKey]);

  useEffect(() => {
    addScript('https://accounts.google.com/gsi/client', true, true, function () {
      tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: SCOPES,
        callback: '',
      });
      setClientloaded(true);
    });
  }, [clientId]);

  const tokenValid = token && Number(expire) > Date.now();

  useEffect(() => {
    if (tokenValid && gapiLoaded && clientLoaded) {
      gapi.client.setToken(token);
      setTokenAvailable(true);
    }
  }, [tokenValid, token, gapiLoaded, clientLoaded]);

  useEffect(() => {
    if (tokenAvailable && token !== null && date) {
      getPath(date).then((newPath) => {
        setPath(newPath);
      });
    }
  }, [token, date, tokenAvailable]);

  const authGoogleClient = () => {
    tokenClient.callback = async (resp: any) => {
      if (resp.error !== undefined) {
        throw resp;
      } else {
        const token = gapi.client.getToken();

        //@ts-ignore
        setToken(token);
        //@ts-ignore
        setTokenExpire(Date.now() + token.expires_in * 1000);
      }
    };

    if (gapi?.client.getToken() === null) {
      // Prompt the user to select a Google Account and ask for consent to share their data
      // when establishing a new session.
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      // Skip display of account chooser and consent dialog for an existing session.
      tokenClient.requestAccessToken({ prompt: '' });
    }
  };

  return (
    <AppCard title="">
      {tokenValid ? (
        <>
          <AppTextField
            label="Dateiname"
            value={fileName}
            onChange={(ev) => {
              setFileName(ev.target.value);
            }}
            InputProps={{
              endAdornment: '.pdf',
            }}
          />
          <AppTextField label="Ziel Ordner" disabled value={path.join('/')} />
          <Box display={'flex'} justifyContent="center">
            <Button startIcon={<BackupOutlinedIcon />}>Upload</Button>
          </Box>
        </>
      ) : (
        <Box height="100%" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
          <Button onClick={authGoogleClient} variant="contained">
            Anmeldung
          </Button>
        </Box>
      )}
    </AppCard>
  );
}

function useLocalStorage(storageKey: string) {
  const [value, setValue] = useState(
    JSON.parse(
      //@ts-ignore
      localStorage.getItem(storageKey),
    ),
  );

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(value));
  }, [value, storageKey]);

  return [value, setValue];
}
