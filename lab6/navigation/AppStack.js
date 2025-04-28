import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

const Stack = createStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Мій Профіль' }}/>
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Редагувати Профіль' }} />
    </Stack.Navigator>
  );
};

export default AppStack;