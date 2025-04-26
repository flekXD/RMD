import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '../theme/useTheme';

const TabBarContainer = styled.View`
  flex-direction: row;
  height: 60px;
  background-color: ${props => props.theme.tabBar};
  border-top-width: 1px;
  border-top-color: ${props => props.theme.divider};
`;

const TabButton = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const TabIcon = styled.Text`
  font-size: 22px;
  color: ${props => props.focused ? props.theme.tabBarActive : props.theme.tabBarInactive};
  margin-bottom: 3px;
`;

const TabLabel = styled.Text`
  font-size: 10px;
  color: ${props => props.focused ? props.theme.tabBarActive : props.theme.tabBarInactive};
`;

const BottomTabBar = ({ state, descriptors, navigation }) => {
  const { theme } = useTheme();

  return (
    <TabBarContainer theme={theme}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel || options.title || route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        // Icons for different tabs
        let iconText;
        switch (route.name) {
          case 'Store':
            iconText = '🏪';
            break;
          case 'Community':
            iconText = '👥';
            break;
          case 'Chat':
            iconText = '💬';
            break;
          case 'Safety':
            iconText = '🛡️';
            break;
          case 'Profile':
            iconText = '👤';
            break;
          default:
            iconText = '📱';
        }

        return (
          <TabButton
            key={index}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
          >
            <TabIcon theme={theme} focused={isFocused}>{iconText}</TabIcon>
            <TabLabel theme={theme} focused={isFocused}>{label}</TabLabel>
          </TabButton>
        );
      })}
    </TabBarContainer>
  );
};

export default BottomTabBar;