import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { resetPassword } = useAuth();

  const handleReset = async () => {
    if (!email) {
      alert("Будь ласка, введіть ваш email.");
      return;
    }
    setIsSending(true);
    await resetPassword(email);
    setIsSending(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Відновлення пароля</Text>
      <Text style={styles.instructions}>Введіть ваш email, щоб отримати інструкції для скидання пароля.</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {isSending ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Надіслати інструкції" onPress={handleReset} disabled={isSending}/>
      )}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>Назад до Входу</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },
      instructions: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
        color: 'grey',
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    link: {
        marginTop: 15,
        color: 'blue',
        textDecorationLine: 'underline',
    },
});

export default ForgotPasswordScreen;