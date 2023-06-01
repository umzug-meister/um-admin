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

  let rootFolder = getByNameRegEx('Umzug Ruckzuck', allFolders);
  if (rootFolder) {
    path.push(rootFolder.name);
  } else {
    //TODO: create
  }

  const parts = date.split('.');
  const month = parts[1];
  const year = parts[2];

  const inRoot = await listFoldersByFolderId(rootFolder!.id);
  const yearFolder = getByNameRegEx(`Auftrag ${year}`, inRoot);

  if (yearFolder) {
    path.push(yearFolder.name);
  } else {
    //TODO: create
  }

  const inYear = await listFoldersByFolderId(yearFolder!.id);

  const monthFolder = getByNameRegEx(`${month}.*${year}`, inYear);

  if (monthFolder) {
    path.push(monthFolder.name);
  } else {
    //TODO: create
  }

  return path;
}
