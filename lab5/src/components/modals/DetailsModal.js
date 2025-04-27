import React from 'react';
import { Modal, View, Text, Button, StyleSheet, ScrollView, Platform } from 'react-native';

const DetailsModal = ({ visible, onClose, item, formatBytes, formatDate }) => {
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
          <Text style={styles.modalTitle}>Деталі</Text>
          <ScrollView style={styles.detailsScrollView}>
              <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Ім'я:</Text>
                  <Text style={styles.detailValue} selectable={true}>{item.name}</Text>
              </View>
              <View style={styles.detailRow}>
                   <Text style={styles.detailLabel}>Тип:</Text>
                   <Text style={styles.detailValue}>{item.type}</Text>
               </View>
              {!item.isDirectory && (
                <View style={styles.detailRow}>
                   <Text style={styles.detailLabel}>Розмір:</Text>
                   <Text style={styles.detailValue}>{formatBytes(item.size ?? 0)}</Text>
                </View>
              )}
               {item.modificationTime && (
                   <View style={styles.detailRow}>
                       <Text style={styles.detailLabel}>Змінено:</Text>
                       <Text style={styles.detailValue}>{formatDate(item.modificationTime)}</Text>
                   </View>
               )}
              <View style={[styles.detailRow, styles.uriRow]}>
                   <Text style={styles.detailLabel}>Шлях (URI):</Text>
                   <Text style={styles.detailUriValue} selectable={true}>{item.uri}</Text>
               </View>
           </ScrollView>

          <View style={styles.modalButtonContainer}>
            <Button
                title="Закрити"
                onPress={onClose}
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
    maxHeight: '80%',
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailsScrollView: {
     marginBottom: 15,
     maxHeight: 400,
  },
  detailRow: {
     flexDirection: 'row',
     marginBottom: 10,
     alignItems: 'flex-start',
  },
  detailLabel: {
     fontWeight: 'bold',
     marginRight: 8,
     width: 80,
     color: '#555',
  },
  detailValue: {
     flex: 1,
     fontSize: 15,
     color: '#333',
  },
   uriRow: {
      flexDirection: 'column',
      alignItems: 'flex-start',
   },
  detailUriValue: {
      fontSize: 13,
      color: '#666',
      marginTop: 3,
  },
  modalButtonContainer: {
    alignSelf: 'center',
    marginTop: 10,
  },
});

export default DetailsModal;