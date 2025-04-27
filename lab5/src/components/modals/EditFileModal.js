import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet, SafeAreaView, Platform, KeyboardAvoidingView, ActivityIndicator } from 'react-native';

const EditFileModal = ({
  visible,
  onClose,
  onSubmit,
  initialUri,
  initialName,
  initialContent,
  isLoading,
}) => {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      setContent(initialContent ?? '');
    }
  }, [visible, initialContent]);

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      await onSubmit(initialUri, content);
    } catch (error) {
      console.error("Save failed in modal:", error)
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoiding}
            >
                <View style={styles.editModalView}>
                  <Text style={styles.editModalTitle} numberOfLines={1}>
                      Редагування: {initialName}
                  </Text>
                  <TextInput
                    style={styles.editInput}
                    value={content}
                    onChangeText={setContent}
                    multiline={true}
                    autoFocus={false}
                    textAlignVertical="top"
                    scrollEnabled={true}
                    editable={!isLoading && !isSaving}
                  />
                   {(isLoading || isSaving) && (
                       <View style={styles.savingIndicator}>
                           <ActivityIndicator size="small" color="#007AFF" />
                           <Text style={styles.savingText}>Збереження...</Text>
                       </View>
                   )}
                  <View style={styles.modalButtonContainer}>
                    <Button
                        title="Скасувати"
                        onPress={onClose}
                        color={Platform.OS === 'ios' ? '#FF3B30' : null}
                        disabled={isLoading || isSaving}
                    />
                     <View style={{ width: 20 }} />
                    <Button
                        title="Зберегти"
                        onPress={handleSubmit}
                        disabled={isLoading || isSaving}
                        color={Platform.OS === 'ios' ? '#007AFF' : null}
                    />
                  </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    keyboardAvoiding: {
        flex: 1,
    },
    editModalView: {
        flex: 1,
        padding: 15,
    },
    editModalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    editInput: {
        flex: 1,
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 15,
        fontSize: 16,
        borderRadius: 8,
        marginBottom: 15,
        textAlignVertical: 'top',
        backgroundColor: '#f9f9f9',
    },
    savingIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 70,
        left: 0,
        right: 0,
        padding: 5,
    },
    savingText: {
        marginLeft: 10,
        fontSize: 14,
        color: '#007AFF',
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
});

export default EditFileModal;