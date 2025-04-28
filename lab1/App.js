import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList } from 'react-native';
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
  return <View><Text>Екран Фотогалереї</Text></View>;
}

function ProfileScreen() {
  return <View><Text>Екран Профілю</Text></View>;
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Tab.Navigator>
        <Tab.Screen name="Головна" component={NewsScreen} />
        <Tab.Screen name="Фотогалерея" component={GalleryScreen} />
        <Tab.Screen name="Профіль" component={ProfileScreen} />
      </Tab.Navigator>
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
});