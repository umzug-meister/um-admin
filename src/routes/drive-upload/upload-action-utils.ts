import { GridApiContext } from '@mui/x-data-grid';
import { MIMEType } from 'util';

export interface GFile {
  id: string;
  name: string;
}

export function getByNameRegEx(pattern: string, files: GFile[]) {
  return files?.find((f) => new RegExp(pattern).test(f.name));
}
export async function listAllFoldersInFolder() {
  let response;
  try {
    //@ts-ignore
    response = await gapi.client.drive.files.list({
      pageSize: 100,
      fields: 'files(id, name)',
      q: `mimeType = 'application/vnd.google-apps.folder'`,
    });
  } catch (e) {
    console.error(e);
  }
  return response.result.files as GFile[];
}

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

function getBearerToken() {
  //@ts-ignore
  return gapi.auth.getToken().access_token;
}

function createFolder(name: string, parent: string) {
  const metadata = {
    name,
    mimeType: 'application/vnd.google-apps.folder',
    parents: [parent],
  };

  return fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: new Headers({ Authorization: 'Bearer ' + getBearerToken() }),
    body: JSON.stringify(metadata),
  })
    .then((res: any) => res.json())
    .then((data) => data as GFile);
}

export async function listFoldersByFolderId(id: string) {
  let response;
  try {
    //@ts-ignore
    response = await gapi.client.drive.files.list({
      pageSize: 100,
      fields: 'files(id, name)',
      q: `'${id}' in parents and mimeType = 'application/vnd.google-apps.folder'`,
    });
  } catch (e) {
    console.error(e);
  }
  return response.result.files as GFile[];
}

export async function uploadFile(name: string, parent: string, base64: string) {
  const base64Res = await fetch(base64);
  const body = await base64Res.blob();

  //@ts-ignore
  return gapi.client.drive.files
    .list({
      'content-type': 'application/json',
      uploadType: 'multipart',
      name,
      mimeType: 'application/pdf',
      fields: 'id, name, kind, size',
    })
    .then((response) => {
      fetch(`https://www.googleapis.com/upload/drive/v3/files/${response.result.id}`, {
        method: 'PATCH',
        headers: new Headers({
          Authorization: `Bearer ${getBearerToken()}`,
          'Content-Type': 'application/pdf',
        }),
        body,
      });
    });
}

export async function listFilesInFolder(id: string) {
  let response;
  try {
    //@ts-ignore
    response = await gapi.client.drive.files.list({
      pageSize: 500,
      fields: 'files(id, name)',
      q: `'${id}' in parents`,
    });
  } catch (e) {
    console.error(e);
  }

  return response.result.files as GFile[];
}

export async function getPath(date: string): Promise<string[]> {
  const path: string[] = [];
  if (!date) {
    return [];
  }
  const allFolders = await listAllFoldersInFolder();

  let rootFolder = getByNameRegEx('Umzug Test', allFolders);
  if (rootFolder) {
    path.push(rootFolder.name);
  } else {
    return [];
  }

  const parts = date.split('.');
  const month = parts[1];
  const year = parts[2];

  const inRoot = await listFoldersByFolderId(rootFolder.id);
  let yearFolder = getByNameRegEx(`Auftrag ${year}`, inRoot);

  if (!yearFolder) {
    yearFolder = await createFolder(`Auftrag ${year}`, rootFolder.id);
  }

  path.push(yearFolder.name);

  const inYear = await listFoldersByFolderId(yearFolder.id);

  let monthFolder = getByNameRegEx(`${month}.*${year}`, inYear);

  if (!monthFolder) {
    monthFolder = await createFolder(`${month} ${Months[Number(month) - 1]} ${year}`, yearFolder.id);
  }

  path.push(monthFolder.name);

  return path;
}
