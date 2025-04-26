import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '../theme/useTheme';

const HeaderContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  background-color: ${props => props.theme.background2};
`;

const HeaderTitle = styled.Text`
  color: ${props => props.theme.text};
  font-size: 24px; /* Розмір шрифту */
  font-weight: bold;
  margin-left: 15px; /* Відступ від картинки */
`;

const HeaderIcon = styled.Text`
  color: ${props => props.theme.accent};
  font-size: 20px;
`;

const HeaderImage = styled.Image`
  width: 40px; /* Розмір картинки */
  height: 40px; /* Розмір картинки */
`;

const Header = ({ title, onPressLeft, onPressRight, leftIcon, rightIcon }) => {
  const { theme } = useTheme();

  return (
    <HeaderContainer theme={theme}>
      {leftIcon && (
        <TouchableOpacity onPress={onPressLeft}>
          <HeaderIcon theme={theme}>{leftIcon}</HeaderIcon>
        </TouchableOpacity>
      )}
      <HeaderContainer style={{ flexDirection: 'row', alignItems: 'center' }}>
        <HeaderImage source={require('./steam.png')} />
        <HeaderTitle theme={theme}>{title}</HeaderTitle>
      </HeaderContainer>
      {rightIcon && (
        <TouchableOpacity onPress={onPressRight}>
          <HeaderIcon theme={theme}>{rightIcon}</HeaderIcon>
        </TouchableOpacity>
      )}
    </HeaderContainer>
  );
};

export default Header;
