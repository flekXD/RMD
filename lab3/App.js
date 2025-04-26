import 'react-native-gesture-handler'; // Імпорт має бути зверху
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Обов'язково!
import { Ionicons } from '@expo/vector-icons'; // Для іконок (треба встановити @expo/vector-icons якщо ще не має)

import GameScreen from './screens/GameScreen';
import TasksScreen from './screens/TasksScreen';
import { GameProvider } from './contexts/GameContext'; // Імпорт провайдера

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    // Обертаємо все в GestureHandlerRootView
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Обертаємо навігацію в GameProvider */}
      <GameProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Гра') {
                  iconName = focused ? 'game-controller' : 'game-controller-outline';
                } else if (route.name === 'Завдання') {
                  iconName = focused ? 'list-circle' : 'list-circle-outline';
                }

                // Ви можете повернути будь-який компонент тут!
                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#3498db', // Колір активної вкладки
              tabBarInactiveTintColor: 'gray', // Колір неактивної вкладки
              headerShown: false, // Приховуємо стандартний заголовок екрану
            })}
          >
            <Tab.Screen name="Гра" component={GameScreen} />
            <Tab.Screen name="Завдання" component={TasksScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </GameProvider>
    </GestureHandlerRootView>
  );
}