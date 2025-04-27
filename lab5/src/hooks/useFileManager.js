import { useState, useEffect, useCallback } from 'react';
import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';
import { BASE_DIR_URI } from '../constants/fileSystem';

export const useFileManager = () => {
  const [currentPath, setCurrentPath] = useState('');
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [storageInfo, setStorageInfo] = useState({ total: 0, free: 0, used: 0 });

  const fetchStorageInfo = useCallback(async () => {
    try {
      const total = await FileSystem.getTotalDiskCapacityAsync();
      const free = await FileSystem.getFreeDiskStorageAsync();
      setStorageInfo({
        total: total ?? 0,
        free: free ?? 0,
        used: (total ?? 0) - (free ?? 0),
      });
    } catch (e) {
      console.error("Error fetching storage info:", e);
      setError('Не вдалося отримати інформацію про сховище.');
    }
  }, []);

  const readDirectory = useCallback(async (relativePath) => {
    setIsLoading(true);
    setError(null);
    const fullUri = BASE_DIR_URI + relativePath;

    try {
      console.log(`Reading directory: ${fullUri}`);
      const dirInfo = await FileSystem.getInfoAsync(fullUri);
      if (!dirInfo.exists || !dirInfo.isDirectory) {
        throw new Error(`Директорія '${relativePath || '/'}' не знайдена або не є папкою.`);
      }

      const resultNames = await FileSystem.readDirectoryAsync(fullUri);

      const entriesDetailsPromises = resultNames.map(async (name) => {
        const itemUri = `${fullUri}${name}`;
        try {
          const info = await FileSystem.getInfoAsync(itemUri, { size: true });
          if (!info.exists) {
            console.warn(`Item no longer exists during read: ${itemUri}`);
            return null;
          }
          return {
            name: name,
            isDirectory: info.isDirectory,
            uri: info.uri,
            size: info.size,
            modificationTime: info.modificationTime,
          };
        } catch (itemError) {
          console.error(`Error getting info for ${itemUri}:`, itemError);
          return null;
        }
      });

      const entriesDetails = await Promise.all(entriesDetailsPromises);
      const validEntries = entriesDetails.filter(entry => entry !== null);

      validEntries.sort((a, b) => {
        if (a.isDirectory !== b.isDirectory) {
          return a.isDirectory ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });

      setEntries(validEntries);
      setCurrentPath(relativePath);

    } catch (e) {
      console.error("Error reading directory:", e);
      setError(`Помилка читання директорії: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      try {
        const dirInfo = await FileSystem.getInfoAsync(BASE_DIR_URI);
        if (!dirInfo.exists) {
          console.log(`Base directory ${BASE_DIR_URI} does not exist. Creating...`);
          await FileSystem.makeDirectoryAsync(BASE_DIR_URI, { intermediates: true });
          console.log("Base directory created.");
        } else if (!dirInfo.isDirectory) {
            console.error(`Base path ${BASE_DIR_URI} exists but is not a directory!`);
            setError(`Критична помилка: Шлях ${BASE_DIR_URI} зайнятий файлом.`);
            setIsLoading(false);
            return;
        } else {
            console.log(`Base directory ${BASE_DIR_URI} exists.`);
        }
        await fetchStorageInfo();
        await readDirectory('');
      } catch (e) {
        console.error("Initialization error:", e);
        setError(`Помилка ініціалізації: ${e.message}`);
        setIsLoading(false);
      }
    };
    initialize();
  }, [readDirectory, fetchStorageInfo]);

  const refreshDirectory = useCallback(() => {
    readDirectory(currentPath);
  }, [currentPath, readDirectory]);

  const navigate = useCallback((entry) => {
    if (entry.isDirectory) {
      const newPath = currentPath ? `${currentPath}${entry.name}/` : `${entry.name}/`;
      readDirectory(newPath);
    }
  }, [currentPath, readDirectory]);

  const navigateUp = useCallback(() => {
    if (currentPath === '') return;
    const pathSegments = currentPath.split('/').filter(segment => segment !== '');
    pathSegments.pop();
    const newPath = pathSegments.join('/') + (pathSegments.length > 0 ? '/' : '');
    readDirectory(newPath);
  }, [currentPath, readDirectory]);

  const createDirectory = useCallback(async (name) => {
    const newFolderPath = BASE_DIR_URI + currentPath + name.trim();
    try {
      setIsLoading(true);
      await FileSystem.makeDirectoryAsync(newFolderPath);
      await readDirectory(currentPath);
    } catch (e) {
      console.error("Error creating directory:", e);
      Alert.alert('Помилка', `Не вдалося створити папку '${name}': ${e.message}`);
      throw e;
    }
  }, [currentPath, readDirectory]);

  const createFile = useCallback(async (name, content) => {
    let fileName = name.trim();
    if (!fileName.endsWith('.txt')) {
      fileName += '.txt';
    }
    const newFilePath = BASE_DIR_URI + currentPath + fileName;
    try {
      setIsLoading(true);
      await FileSystem.writeAsStringAsync(newFilePath, content || '');
      await readDirectory(currentPath);
    } catch (e) {
      console.error("Error creating file:", e);
      Alert.alert('Помилка', `Не вдалося створити файл '${fileName}': ${e.message}`);
      throw e;
    }
  }, [currentPath, readDirectory]);

  const readFileContent = useCallback(async (uri) => {
    try {
      const content = await FileSystem.readAsStringAsync(uri);
      return content;
    } catch (e) {
      console.error("Error reading file content:", e);
      Alert.alert('Помилка', `Не вдалося прочитати файл: ${e.message}`);
      throw e;
    }
  }, []);

  const saveFileContent = useCallback(async (uri, content) => {
    try {
      setIsLoading(true);
      await FileSystem.writeAsStringAsync(uri, content);
      await readDirectory(currentPath);
    } catch (e) {
      console.error("Error saving file:", e);
      Alert.alert('Помилка', `Не вдалося зберегти зміни: ${e.message}`);
      throw e;
    }
  }, [currentPath, readDirectory]);

  const deleteItem = useCallback(async (uri) => {
    try {
      setIsLoading(true);
      await FileSystem.deleteAsync(uri, { idempotent: true });
      await readDirectory(currentPath);
    } catch (e) {
      console.error("Error deleting item:", e);
      throw e;
    }
  }, [currentPath, readDirectory]);

  const getItemInfo = useCallback(async (uri) => {
    try {
      const info = await FileSystem.getInfoAsync(uri, { size: true });
      if (!info.exists) {
        throw new Error('Елемент більше не існує.');
      }
      return info;
    } catch (e) {
      console.error("Error getting item info:", e);
      throw e;
    }
  }, []);

  return {
    currentPath,
    entries,
    isLoading,
    error,
    storageInfo,
    baseUri: BASE_DIR_URI,
    navigate,
    navigateUp,
    createDirectory,
    createFile,
    readFileContent,
    saveFileContent,
    deleteItem,
    refreshDirectory,
    fetchStorageInfo,
    getItemInfo,
    setError,
  };
};