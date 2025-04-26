import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './theme/ThemeProvider';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBar translucent backgroundColor="transparent" />
        <AppNavigator />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}