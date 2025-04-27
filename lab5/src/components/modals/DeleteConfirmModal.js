import React from 'react';
import { Modal, View, Text, Button, StyleSheet, Platform } from 'react-native';

const DeleteConfirmModal = ({ visible, onClose, onSubmit, item, isLoading }) => {
  if (!item) {
    return null;
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalCenteredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Підтвердження видалення</Text>
          <Text style={styles.confirmText}>
            Ви впевнені, що хочете видалити{' '}
            <Text style={styles.itemName}>{item.isDirectory ? 'папку' : 'файл'}</Text>
            {' '}
            "{item.name}"?
          </Text>
          {item.isDirectory && (
            <Text style={styles.warningText}>
              УВАГА: Весь вміст цієї папки буде видалено безповоротно!
            </Text>
          )}
          <View style={styles.modalButtonContainer}>
            <Button
              title="Скасувати"
              onPress={onClose}
              disabled={isLoading}
              color={Platform.OS === 'ios' ? '#007AFF' : null}
            />
            <View style={{ width: 20 }} />
            <Button
              title="Видалити"
              onPress={onSubmit}
              color="#FF3B30"
              disabled={isLoading}
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
    alignItems: 'center',
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
  confirmText: {
    marginBottom: 10,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  itemName: {
    fontWeight: 'bold',
  },
  warningText: {
    marginBottom: 20,
    fontSize: 15,
    color: '#FF3B30',
    textAlign: 'center',
    fontWeight: '500',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    width: '100%',
  },
});

export default DeleteConfirmModal;