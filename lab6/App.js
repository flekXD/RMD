import React from 'react';
import { AuthProvider } from './context/AuthContext';
import AppNavigator from './navigation/AppNavigator';
import { LogBox } from 'react-native';

// Ігнорувати попередження про AsyncStorage, яке може з'являтися з Firebase v9+ SDK в Expo Go
// Це відома проблема, Firebase все одно працює коректно з Expo.
LogBox.ignoreLogs(["AsyncStorage has been extracted from react-native core"]);
// Ігнорувати попередження про timer, яке іноді виникає з Firebase
LogBox.ignoreLogs(['Setting a timer']);


export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}