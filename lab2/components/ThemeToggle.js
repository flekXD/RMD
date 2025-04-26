import React from 'react';
import { Switch } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '../theme/useTheme';

const ToggleContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: ${props => props.theme.card};
  border-radius: 8px;
  margin: 8px 16px;
`;

const ToggleText = styled.Text`
  color: ${props => props.theme.text};
  font-size: 16px;
`;

const ThemeToggle = () => {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <ToggleContainer theme={theme}>
      <ToggleText theme={theme}>Dark Theme</ToggleText>
      <Switch
        value={isDark}
        onValueChange={toggleTheme}
        trackColor={{ false: '#767577', true: theme.accent }}
        thumbColor="#f4f3f4"
      />
    </ToggleContainer>
  );
};

export default ThemeToggle;