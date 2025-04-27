import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet, Alert, Platform, ScrollView } from 'react-native';

const CreateFileModal = ({ visible, onClose, onSubmit, isLoading }) => {
  const [fileName, setFileName] = useState('');
  const [fileContent, setFileContent] = useState('');

  useEffect(() => {
    if (visible) {
      setFileName('');
      setFileContent('');
    }
  }, [visible]);

  const handleSubmit = () => {
    const name = fileName.trim();
    if (!name) {
      Alert.alert('Помилка', 'Назва файлу не може бути порожньою.');
      return;
    }
    if (/[\\/*?:<>|"]/.test(name)) {
      Alert.alert('Помилка', 'Назва файлу містить недопустимі символи: \\ / * ? : < > | "');
      return;
    }
    onSubmit(name, fileContent);
  };

  const handleClose = () => {
    setFileName('');
    setFileContent('');
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
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Створити новий .txt файл</Text>
              <TextInput
                style={styles.input}
                placeholder="Назва файлу (без .txt)"
                value={fileName}
                onChangeText={setFileName}
                autoCapitalize="none"
                autoFocus={true}
              />
              <TextInput
                style={[styles.input, styles.multilineInput]}
                placeholder="Початковий вміст файлу (необов'язково)"
                value={fileContent}
                onChangeText={setFileContent}
                multiline={true}
                numberOfLines={5}
                textAlignVertical="top"
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
                  disabled={isLoading || !fileName.trim()}
                  color={Platform.OS === 'ios' ? '#007AFF' : null}
                />
              </View>
            </View>
         </ScrollView>
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
    scrollViewContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        width: '100%',
    },
    modalView: {
        marginHorizontal: 20,
        marginVertical: 50,
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
        alignSelf: 'center',
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
        marginBottom: 15,
        paddingHorizontal: 15,
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
        fontSize: 16,
    },
    multilineInput: {
        height: 120,
        textAlignVertical: 'top',
        marginBottom: 20,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
    },
});

export default CreateFileModal;