import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  Text,
  SafeAreaView,
  Alert,
  Button,
  Platform
} from 'react-native';

import { useFileManager } from './src/hooks/useFileManager';
import { APP_DATA_DIR_NAME } from './src/constants/fileSystem';
import { formatBytes, formatDate } from './src/utils/formatting';

import StorageStats from './src/components/StorageStats';
import NavigationBar from './src/components/NavigationBar';
import FileListItem from './src/components/FileListItem';
import CreateFolderModal from './src/components/modals/CreateFolderModal';
import CreateFileModal from './src/components/modals/CreateFileModal';
import EditFileModal from './src/components/modals/EditFileModal';
import DetailsModal from './src/components/modals/DetailsModal';
import DeleteConfirmModal from './src/components/modals/DeleteConfirmModal';

const App = () => {
  const {
    currentPath,
    entries,
    isLoading,
    error,
    storageInfo,
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
    setError
  } = useFileManager();

  const [isCreateFolderModalVisible, setCreateFolderModalVisible] = useState(false);
  const [isCreateFileModalVisible, setCreateFileModalVisible] = useState(false);
  const [isEditFileModalVisible, setEditFileModalVisible] = useState(false);
  const [isDetailsModalVisible, setDetailsModalVisible] = useState(false);
  const [isDeleteConfirmModalVisible, setDeleteConfirmModalVisible] = useState(false);

  const [editingFile, setEditingFile] = useState(null);
  const [detailsItem, setDetailsItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleOpenCreateFolder = () => setCreateFolderModalVisible(true);
  const handleCloseCreateFolder = () => setCreateFolderModalVisible(false);
  const handleSubmitCreateFolder = async (folderName) => {
    try {
      await createDirectory(folderName);
      handleCloseCreateFolder();
    } catch (e) {
      console.error("Submit Create Folder failed in App:", e);
    }
  };

  const handleOpenCreateFile = () => setCreateFileModalVisible(true);
  const handleCloseCreateFile = () => setCreateFileModalVisible(false);
  const handleSubmitCreateFile = async (fileName, fileContent) => {
    try {
      await createFile(fileName, fileContent);
      handleCloseCreateFile();
    } catch (e) {
      console.error("Submit Create File failed in App:", e);
    }
  };

  const handleOpenFileForEdit = useCallback(async (fileEntry) => {
    if (!fileEntry.name.endsWith('.txt')) {
       handleShowDetails(fileEntry);
      return;
    }
    try {
      const content = await readFileContent(fileEntry.uri);
      setEditingFile({
        uri: fileEntry.uri,
        name: fileEntry.name,
        content: content,
      });
      setEditFileModalVisible(true);
    } catch (e) {
      console.error("Open file for edit failed in App:", e);
    }
  }, [readFileContent, handleShowDetails]); // Додано handleShowDetails в залежності

  const handleCloseEditFile = () => {
    setEditingFile(null);
    setEditFileModalVisible(false);
  };
  const handleSubmitEditFile = async (uri, newContent) => {
    try {
      await saveFileContent(uri, newContent);
      handleCloseEditFile();
    } catch (e) {
      console.error("Submit Edit File failed in App:", e);
    }
  };

  const handleShowDetails = useCallback(async (item) => {
    try {
      const info = await getItemInfo(item.uri);
      setDetailsItem({
        name: item.name,
        type: info.isDirectory ? 'Папка' : (item.name.split('.').pop() || 'Файл').toUpperCase(),
        size: info.size,
        modificationTime: info.modificationTime,
        uri: info.uri,
        isDirectory: info.isDirectory,
      });
      setDetailsModalVisible(true);
    } catch (e) {
      Alert.alert('Помилка', `Не вдалося отримати деталі: ${e.message}`);
      if (e.message.includes('не існує')) {
        refreshDirectory();
      }
    }
  }, [getItemInfo, refreshDirectory]);

  const handleCloseDetails = () => setDetailsModalVisible(false);

  const handleDeleteConfirmation = useCallback((item) => {
    setItemToDelete(item);
    setDeleteConfirmModalVisible(true);
  }, []);

  const handleCloseDeleteConfirmation = () => {
    setItemToDelete(null);
    setDeleteConfirmModalVisible(false);
  };
  const handleSubmitDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteItem(itemToDelete.uri);
      handleCloseDeleteConfirmation();
    } catch (e) {
      Alert.alert('Помилка видалення', `Не вдалося видалити "${itemToDelete?.name}": ${e.message}`);
    }
  };

  const handleNavigateItem = useCallback((item) => {
    if (item.isDirectory) {
      navigate(item);
    } else {
      handleOpenFileForEdit(item);
    }
  }, [navigate, handleOpenFileForEdit]);

  const renderListItem = useCallback(({ item }) => (
    <FileListItem
      item={item}
      onPressItem={handleNavigateItem}
      onShowDetails={handleShowDetails}
      onDeleteItem={handleDeleteConfirmation}
    />
  ), [handleNavigateItem, handleShowDetails, handleDeleteConfirmation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StorageStats
          storageInfo={storageInfo}
          onRefresh={fetchStorageInfo}
          isLoading={isLoading}
        />

        <NavigationBar
          currentPath={currentPath}
          onNavigateUp={navigateUp}
          isLoading={isLoading}
        />

        {isLoading && <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />}

        {error && !isLoading && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <Button title="Спробувати знову" onPress={refreshDirectory} />
            <Button title="Закрити помилку" onPress={() => setError(null)} color="grey" />
          </View>
        )}

        {!isLoading && !error && (
          <FlatList
            data={entries}
            renderItem={renderListItem}
            keyExtractor={(item) => item.uri}
            ListEmptyComponent={<Text style={styles.emptyText}>Папка порожня</Text>}
            contentContainerStyle={styles.listContentContainer}
            onRefresh={refreshDirectory}
            refreshing={isLoading}
          />
        )}

        <View style={styles.actionButtonsContainer}>
          <Button
              title="Створити папку"
              onPress={handleOpenCreateFolder}
              disabled={isLoading}
          />
          <View style={{width: 10}} />
          <Button
              title="Створити .txt"
              onPress={handleOpenCreateFile}
              disabled={isLoading}
          />
        </View>

        <CreateFolderModal
          visible={isCreateFolderModalVisible}
          onClose={handleCloseCreateFolder}
          onSubmit={handleSubmitCreateFolder}
          isLoading={isLoading}
        />

        <CreateFileModal
          visible={isCreateFileModalVisible}
          onClose={handleCloseCreateFile}
          onSubmit={handleSubmitCreateFile}
          isLoading={isLoading}
        />

        { editingFile && (
          <EditFileModal
            visible={isEditFileModalVisible}
            onClose={handleCloseEditFile}
            onSubmit={handleSubmitEditFile}
            initialUri={editingFile.uri}
            initialName={editingFile.name}
            initialContent={editingFile.content}
            isLoading={isLoading}
          />
        )}

        { detailsItem && (
          <DetailsModal
            visible={isDetailsModalVisible}
            onClose={handleCloseDetails}
            item={detailsItem}
            formatBytes={formatBytes}
            formatDate={formatDate}
          />
        )}

        { itemToDelete && (
          <DeleteConfirmModal
            visible={isDeleteConfirmModalVisible}
            onClose={handleCloseDeleteConfirmation}
            onSubmit={handleSubmitDelete}
            item={itemToDelete}
            isLoading={isLoading}
          />
        )}

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  loader: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    zIndex: 10,
  },
  errorContainer: {
    marginVertical: 20,
    marginHorizontal: 10,
    padding: 15,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffcdd2'
  },
  errorText: {
    color: '#b71c1c',
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 16,
  },
  listContentContainer: {
    paddingBottom: 70,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
  },
  actionButtonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
    backgroundColor: '#f0f0f0',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    zIndex: 5,
  },
});

export default App;