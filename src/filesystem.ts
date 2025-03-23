import { glob } from 'glob';
import fs from 'fs';
import path from 'path';

const globSearch = async (
  rootDir: string,
  onlyDirectChild: boolean,
  names: string[],
): Promise<string[]> => {
  if (names.length < 1) {
    throw new Error('names must have at least 1 name');
  }

  let basePattern = `${asPath(rootDir)}/`;
  if (!onlyDirectChild) {
    basePattern += '**/';
  }

  const patterns: string[] = [];
  names.forEach((n) => {
    patterns.push(basePattern + n);
  });
  return glob(patterns, { nodir: false, absolute: true });
};

const getParentPath = (itemPath: string) => path.dirname(itemPath);
const asPath = (pathStr: string) => pathStr.replace(/\\/g, '/');

const deleteFolder = async (folderPath: string) => {
  if (fs.existsSync(folderPath)) {
    console.info(`Deleting ${folderPath}`);
    await fs.promises.rmdir(folderPath, { recursive: true });
  } else {
    console.warn(`Tried to delete ${folderPath}, but it doesn't exist!`);
  }
};

export { globSearch, getParentPath, deleteFolder, asPath };
