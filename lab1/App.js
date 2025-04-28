import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList, TextInput, TouchableOpacity, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

const NewsItem = ({ title, date, content }) => (
  <View style={styles.newsItem}>
    <View style={styles.newsImagePlaceholder}>
      <Text style={styles.placeholderText}>⊞</Text>
    </View>
    <View style={styles.newsContent}>
      <Text style={styles.newsTitle}>{title}</Text>
      <Text style={styles.newsDate}>{date}</Text>
      <Text style={styles.newsText}>{content}</Text>
    </View>
  </View>
);

function NewsScreen() {
  const newsData = Array(8).fill().map((_, i) => ({
    id: i.toString(),
    title: 'Заголовок новини',
    date: 'Дата новини',
    content: 'Короткий текст новини'
  }));

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.screenTitle}>Новини</Text>
      <FlatList
        data={newsData}
        renderItem={({ item }) => (
          <NewsItem
            title={item.title}
            date={item.date}
            content={item.content}
          />
        )}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
}

function GalleryScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.galleryGrid}>
        {Array(10).fill().map((_, i) => (
          <View key={i} style={styles.galleryItemHalfWidth}>
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>📷</Text>
            </View>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.screenTitle}>Реєстрація</Text>
      <View style={styles.form}>
        <Text style={styles.label}>Електронна пошта</Text>
        <TextInput style={styles.input} placeholder="" keyboardType="email-address" />
        <Text style={styles.label}>Пароль</Text>
        <TextInput style={styles.input} placeholder="" secureTextEntry />
        <Text style={styles.label}>Пароль (ще раз)</Text>
        <TextInput style={styles.input} placeholder="" secureTextEntry />
        <Text style={styles.label}>Прізвище</Text>
        <TextInput style={styles.input} placeholder="" />
        <Text style={styles.label}>Ім'я</Text>
        <TextInput style={styles.input} placeholder="" />
        <TouchableOpacity style={styles.registerButton}>
          <Text style={styles.registerButtonText}>Зареєструватися</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function LogoHeader() {
  return (
    <View style={styles.headerContainer}>
      <Image
        source={{ uri: 'https://placehold.co/100x30' }}
        style={styles.logo}
      />
      <Text style={styles.headerTitle}>FirstMobileApp</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <LogoHeader />
        <Tab.Navigator>
          <Tab.Screen name="Головна" component={NewsScreen} />
          <Tab.Screen name="Фотогалерея" component={GalleryScreen} />
          <Tab.Screen name="Профіль" component={ProfileScreen} />
        </Tab.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    textAlign: 'center',
  },
  newsItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  newsImagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  placeholderText: {
    fontSize: 24,
    color: '#aaa',
  },
  newsContent: {
    flex: 1,
  },
  newsTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  newsDate: {
    color: '#666',
    fontSize: 12,
    marginBottom: 4,
  },
  newsText: {
    fontSize: 14,
  },
  galleryGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 5,
    justifyContent: 'space-between',
  },
  galleryItemHalfWidth: {
    width: '48%',
    aspectRatio: 1,
    margin: '1%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    padding: 20,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  registerButton: {
    backgroundColor: '#0066cc',
    height: 45,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});