import BackupOutlinedIcon from '@mui/icons-material/BackupOutlined';
import CloudDoneOutlinedIcon from '@mui/icons-material/CloudDoneOutlined';
import CloudOffOutlinedIcon from '@mui/icons-material/CloudOffOutlined';
import CloudSyncOutlinedIcon from '@mui/icons-material/CloudSyncOutlined';
import { IconButton, Tooltip } from '@mui/material';

import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { addScript } from '../..';
import { useAppServices } from '../../hooks/useAppServices';
import { useCurrentOrder } from '../../hooks/useCurrentOrder';
import { useOption } from '../../hooks/useOption';
import { useSaveOrder } from '../../hooks/useSaveOrder';
import { generateUrzPdf } from '../../pdf/OrderPdf';
import { orderFileName } from '../../pdf/filename';
import { AppState } from '../../store';
import { AppOptions } from '../../store/appReducer';

import { AppPacking, AppService } from 'um-types';

declare var gapi: any;
declare var google: any;

type ButtonStateType = 'ready' | 'upload' | 'success' | 'error';

//#region Component

export default function UploadAction() {
  const currentOrder = useCurrentOrder();
  const saveOrder = useSaveOrder();

  const [token, setToken] = useLocalStorage('google_token');
  const [expire, setTokenExpire] = useLocalStorage('google_token_expire');

  const [gapiLoaded, setGapiLoaded] = useState(false);
  const [tokenAvailable, setTokenAvailable] = useState(false);

  const gapiKey = useOption('gapikey');
  const clientId = useOption('clientId');
  const options = useSelector<AppState, AppOptions>((s) => s.app.options);
  const [services] = useState(useAppServices<AppService>('Bohrarbeiten'));
  const [packings] = useState(useAppServices<AppPacking>('Packmaterial'));

  const [buttonState, setButtonState] = useState<ButtonStateType>('ready');

  const tClient = useRef<any>(null);

  useEffect(() => {
    if (gapiKey) {
      initGapi(gapiKey, () => {
        setGapiLoaded(true);
      });
    }
  }, [gapiKey]);

  useEffect(() => {
    console.log('Init client');
    addScript('https://accounts.google.com/gsi/client', true, true, function () {
      tClient.current = initClient(clientId);
    });
  }, [clientId]);

  const tokenValid = token && Number(expire) > Date.now();

  useEffect(() => {
    if (tokenValid && gapiLoaded && tClient.current !== null) {
      console.log('setze token auf verfügbar');
      setGapiToken(token);
      setTokenAvailable(true);
    }
  }, [tokenValid, token, gapiLoaded]);

  useEffect(() => {
    if (tokenAvailable && buttonState === 'upload' && currentOrder) {
      console.log('TODO: upload');
      const orderAsBase64 = generateUrzPdf({
        options,
        order: currentOrder,
        services: [...services, ...packings],
        base64: true,
      });
      if (currentOrder.date && orderAsBase64) {
        const fileName = orderFileName(currentOrder);
        getPath(currentOrder.date, fileName).then((path) => {
          if (path) {
            console.log('path');
            console.log(path);
            uploadContent(path.fileId, orderAsBase64).then((res) => {
              if (res) {
                setButtonState('success');
                setTimeout(() => {
                  setButtonState('ready');
                }, 3000);
              } else {
                setButtonState('error');
              }
            });
          }
        });
      }
    }
  }, [tokenAvailable, buttonState, currentOrder, options, packings, services]);

  const authGoogleClient = () => {
    if (tClient.current) {
      tClient.current.callback = async (resp: any) => {
        if (resp.error !== undefined) {
          throw resp;
        } else {
          const token = getGapiToken();

          setToken(token);
          setTokenExpire(Date.now() + token.expires_in * 1000);
        }
      };

      if (getGapiToken() === null) {
        // Prompt the user to select a Google Account and ask for consent to share their data
        // when establishing a new session.
        tClient.current.requestAccessToken({ prompt: 'consent' });
      } else {
        // Skip display of account chooser and consent dialog for an existing session.
        tClient.current.requestAccessToken({ prompt: '' });
      }
      setButtonState('upload');
    }
  };

  const onUploadRequest = () => {
    saveOrder(currentOrder).then(() => {
      tokenValid ? setButtonState('upload') : authGoogleClient();
    });
  };

  const iconButton = () => {
    switch (buttonState) {
      case 'ready': {
        return (
          <Tooltip title="Auf Google Drive hochladen">
            <IconButton onClick={onUploadRequest}>
              <BackupOutlinedIcon />
            </IconButton>
          </Tooltip>
        );
      }
      case 'upload':
        return (
          <Tooltip title="wird hochgeladen">
            <IconButton color="primary">
              <CloudSyncOutlinedIcon />
            </IconButton>
          </Tooltip>
        );

      case 'success':
        return (
          <Tooltip title="Erfolgreich hochgeladen">
            <IconButton color="success">
              <CloudDoneOutlinedIcon />
            </IconButton>
          </Tooltip>
        );

      case 'error':
        return (
          <Tooltip title="Ein Fehler ist aufgetreten">
            <IconButton color="error">
              <CloudOffOutlinedIcon />
            </IconButton>
          </Tooltip>
        );

      default:
        return null;
    }
  };

  return iconButton();
}
//#endregion

//#region Hook

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
//#endregion

//#region Gapi init

const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';

function initGapi(apiKey: string, cb: () => void) {
  addScript('https://apis.google.com/js/api.js', true, true, function () {
    gapi.load('client', function () {
      gapi.client
        .init({
          apiKey,
          discoveryDocs: [DISCOVERY_DOC],
        })
        .then(cb);
    });
  });
}

const SCOPES = 'https://www.googleapis.com/auth/drive';

function initClient(clientId: string) {
  return google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: SCOPES,
    callback: '',
  });
}

function setGapiToken(token: any) {
  gapi.client.setToken(token);
}

function getGapiToken() {
  return gapi.client.getToken();
}
//#endregion

//#region Drive method
const Months = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
];

const DRIVE_FILES_URL = 'https://www.googleapis.com/drive/v3/files';

const DRIVE_UPLOAD_URL = (id: string) => `https://www.googleapis.com/upload/drive/v3/files/${id}`;

enum AppMimeTypes {
  G_FILE = 'application/vnd.google-apps.file',
  G_FOLDER = 'application/vnd.google-apps.folder',
  PDF = 'application/pdf',
  JSON = 'application/json',
}

interface GFile {
  id: string;
  name: string;
}

interface LSPayload {
  mimeType: string;
  pageSize?: number;
  parentId?: string;
}

function getByNameRegEx(pattern: string, files: GFile[]) {
  return files?.find((f) => new RegExp(pattern).test(f.name));
}

async function ls({ pageSize = 100, mimeType, parentId }: LSPayload): Promise<GFile[]> {
  let q = `mimeType = '${mimeType}'`;

  if (parentId) {
    q += `and '${parentId}' in parents`;
  }
  const res = await gapi.client.drive.files.list({
    pageSize,
    fields: 'files(id, name)',
    q,
  });
  return res.result.files as GFile[];
}

function foldersIn(parentId?: string) {
  return ls({ mimeType: AppMimeTypes.G_FOLDER, parentId });
}

function filesIn(parentId: string) {
  return ls({ mimeType: AppMimeTypes.PDF, pageSize: 800, parentId });
}

function getBearerToken() {
  return gapi.auth.getToken().access_token;
}

async function mkDir(name: string, parent: string) {
  const metadata = {
    name,
    mimeType: AppMimeTypes.G_FOLDER,
    parents: [parent],
  };

  return fetch(DRIVE_FILES_URL, {
    method: 'POST',
    headers: new Headers({ Authorization: 'Bearer ' + getBearerToken() }),
    body: JSON.stringify(metadata),
  })
    .then((res) => res.json())
    .then((data) => data as GFile);
}

async function touchPdf(name: string, parentId: string): Promise<GFile> {
  return gapi.client.drive.files
    .create({
      'Content-type': AppMimeTypes.JSON,
      name,
      parents: [parentId],
      uploadType: 'multipart',
      mimeType: AppMimeTypes.PDF,
      fields: 'id, name, kind, size',
    })
    .then((res: any) => res.result as GFile);
}

async function uploadContent(id: string, base64: string) {
  const base64Res = await fetch(base64);
  const blob = await base64Res.blob();

  return fetch(DRIVE_UPLOAD_URL(id), {
    method: 'PATCH',
    headers: new Headers({
      Authorization: `Bearer ${getBearerToken()}`,
      'Content-Type': AppMimeTypes.PDF,
    }),
    body: blob,
  }).then((res) => res.ok);
}

interface PathReturn {
  path: string[];
  fileId: string;
}

async function getPath(date: string, fileName: string): Promise<PathReturn | null> {
  const path: string[] = [];
  if (!date) {
    return null;
  }
  const allFolders = await foldersIn();

  let rootFolder = getByNameRegEx('Umzug Test', allFolders);
  debugger;
  if (rootFolder) {
    path.push(rootFolder.name);
  } else {
    return null;
  }

  const parts = date.split('.');
  const month = parts[1];
  const year = parts[2];

  const inRoot = await foldersIn(rootFolder.id);
  let yearFolder = getByNameRegEx(`Auftrag ${year}`, inRoot);

  if (!yearFolder) {
    yearFolder = await mkDir(`Auftrag ${year}`, rootFolder.id);
  }

  path.push(yearFolder.name);

  const inYear = await foldersIn(yearFolder.id);

  let monthFolder = getByNameRegEx(`${month}.*${year}`, inYear);

  if (!monthFolder) {
    monthFolder = await mkDir(`${month} ${Months[Number(month) - 1]} ${year}`, yearFolder.id);
  }

  path.push(monthFolder.name);

  const allFilesInFolder = await filesIn(monthFolder.id);
  let file = allFilesInFolder.find((f) => f.name === fileName);
  if (!file) {
    file = await touchPdf(fileName, monthFolder.id);
  }
  if (file) {
    return { path, fileId: file.id };
  }
  return null;
}

//#endregion
