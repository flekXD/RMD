import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet, Alert, Platform } from 'react-native';

const CreateFolderModal = ({ visible, onClose, onSubmit, isLoading }) => {
  const [folderName, setFolderName] = useState('');

  useEffect(() => {
    if (visible) {
      setFolderName('');
    }
  }, [visible]);

  const handleSubmit = () => {
    const name = folderName.trim();
    if (!name) {
      Alert.alert('Помилка', 'Назва папки не може бути порожньою.');
      return;
    }
    if (/[\\/*?:<>|"]/.test(name)) {
      Alert.alert('Помилка', 'Назва папки містить недопустимі символи: \\ / * ? : < > | "');
      return;
    }
    onSubmit(name);
  };

  const handleClose = () => {
    setFolderName('');
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={styles.modalCenteredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Створити нову папку</Text>
          <TextInput
            style={styles.input}
            placeholder="Назва папки"
            value={folderName}
            onChangeText={setFolderName}
            autoCapitalize="none"
            autoFocus={true}
            onSubmitEditing={handleSubmit}
          />
          <View style={styles.modalButtonContainer}>
            <Button
                title="Скасувати"
                onPress={handleClose}
                color={Platform.OS === 'ios' ? '#FF3B30' : null}
                disabled={isLoading}
            />
             <View style={{ width: 20 }} />
            <Button
              title="Створити"
              onPress={handleSubmit}
              disabled={isLoading || !folderName.trim()}
              color={Platform.OS === 'ios' ? '#007AFF' : null}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalCenteredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 25,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
});

export default CreateFolderModal;