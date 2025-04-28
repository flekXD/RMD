import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';

const EditProfileScreen = ({ navigation }) => {
  const { profile, updateProfile, loading: authLoading } = useAuth();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setAge(profile.age || '');
      setCity(profile.city || '');
    }
  }, [profile]);

  const handleSave = async () => {
    setIsSaving(true);
    const success = await updateProfile({
          name: name.trim(),
          age: age.trim(),
          city: city.trim()
    });
    setIsSaving(false);
    if (success) {
          navigation.goBack();
    }
  };

    if (authLoading) {
        return <ActivityIndicator style={styles.loader} size="large" />;
    }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Ім'я:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ваше ім'я"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Вік:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ваш вік"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Місто:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ваше місто"
        value={city}
        onChangeText={setCity}
      />

      {isSaving ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
      ) : (
          <View style={styles.buttonContainer}>
            <Button title="Зберегти зміни" onPress={handleSave} disabled={isSaving} />
          </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
    buttonContainer: {
        marginTop: 30,
    },
});

export default EditProfileScreen;