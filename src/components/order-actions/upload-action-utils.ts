export interface GFile {
  id: string;
  name: string;
}

export function getByNameRegEx(pattern: string, files: GFile[]) {
  return files.find((f) => new RegExp(pattern).test(f.name));
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
    alert('Fehler beim Ausführen');
  }
  return response.result.files as GFile[];
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
    alert('Fehler beim Ausführen');
  }
  return response.result.files as GFile[];
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
    alert('Fehler beim Ausführen');
  }
  return response.result.files as GFile[];
}
