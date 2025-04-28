import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, ActivityIndicator, TextInput } from 'react-native';
import { useAuth } from '../context/AuthContext';

const ProfileScreen = ({ navigation }) => {
  const { user, profile, logout, deleteAccount, loading: authLoading } = useAuth();
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeletePress = () => {
      Alert.alert(
          "Видалити акаунт?",
          "Ця дія незворотня. Ви впевнені?",
          [
              { text: "Скасувати", style: "cancel" },
              { text: "Так, Видалити", onPress: () => setShowPasswordInput(true) }
          ]
      );
  };

    const confirmDelete = async () => {
        if (!confirmPassword) {
            Alert.alert("Помилка", "Будь ласка, введіть поточний пароль для підтвердження.");
            return;
        }
        setIsDeleting(true);
        await deleteAccount(confirmPassword);
        setIsDeleting(false);
        setShowPasswordInput(false);
        setConfirmPassword('');
    };

  if (authLoading || !user) {
    return <ActivityIndicator style={styles.loader} size="large" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email:</Text>
      <Text style={styles.value}>{user.email}</Text>

      {profile ? (
        <>
          <Text style={styles.label}>Ім'я:</Text>
          <Text style={styles.value}>{profile.name || 'Не вказано'}</Text>
          <Text style={styles.label}>Вік:</Text>
          <Text style={styles.value}>{profile.age || 'Не вказано'}</Text>
          <Text style={styles.label}>Місто:</Text>
          <Text style={styles.value}>{profile.city || 'Не вказано'}</Text>
        </>
      ) : (
          <Text style={styles.value}>Профіль завантажується або не створений...</Text>
      )}

        <View style={styles.buttonContainer}>
            <Button
              title="Редагувати профіль"
              onPress={() => navigation.navigate('EditProfile')}
            />
        </View>

        <View style={styles.buttonContainer}>
            <Button title="Вийти" onPress={logout} color="orange" />
        </View>


        {showPasswordInput && (
            <View style={styles.deleteSection}>
                <Text style={styles.deletePrompt}>Введіть поточний пароль для підтвердження:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Поточний пароль"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />
                {isDeleting ? (
                      <ActivityIndicator size="small" color="red" />
                ) : (
                      <Button title="Підтвердити Видалення" onPress={confirmDelete} color="red" disabled={isDeleting}/>
                )}
                  <Button title="Скасувати" onPress={() => {setShowPasswordInput(false); setConfirmPassword('');}} />
            </View>
        )}

        {!showPasswordInput && (
            <View style={styles.buttonContainer}>
                <Button
                  title="Видалити акаунт"
                  onPress={handleDeletePress}
                  color="red"
                />
            </View>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
    loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    color: 'grey',
  },
  value: {
    fontSize: 18,
    marginBottom: 5,
  },
  buttonContainer: {
    marginTop: 20,
  },
    deleteSection: {
    marginTop: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 5,
    backgroundColor: '#ffebee'
  },
    deletePrompt: {
        marginBottom: 10,
        color: 'red',
        fontWeight: 'bold'
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: 'white',
    },
});

export default ProfileScreen;