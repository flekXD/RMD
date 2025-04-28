import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
        alert("Будь ласка, заповніть усі поля.");
        return;
    }
    if (password !== confirmPassword) {
      alert("Паролі не співпадають!");
      return;
    }
    setIsRegistering(true);
    await register(email, password);
    setIsRegistering(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Реєстрація</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Пароль"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Підтвердіть Пароль"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
        {isRegistering ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
          <Button title="Зареєструватися" onPress={handleRegister} disabled={isRegistering} />
      )}
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Вже є акаунт? Увійти</Text>
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
    marginBottom: 20,
    fontWeight: 'bold',
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

export default RegisterScreen;