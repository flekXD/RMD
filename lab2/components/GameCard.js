import React from 'react';
import styled from 'styled-components/native';
import { useTheme } from '../theme/useTheme';

const CardContainer = styled.TouchableOpacity`
  background-color: ${props => props.theme.card};
  border-radius: 8px;
  margin: 8px 16px;
  overflow: hidden;
`;

const GameImage = styled.Image`
  width: 100%;
  height: 130px;
`;

const GameInfo = styled.View`
  padding: 12px;
`;

const GameTitle = styled.Text`
  color: ${props => props.theme.text};
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 4px;
`;

const GamePrice = styled.Text`
  color: ${props => props.theme.accent};
  font-size: 14px;
`;

const GameDescription = styled.Text`
  color: ${props => props.theme.textSecondary};
  font-size: 12px;
  margin-top: 4px;
`;

const DiscountTag = styled.View`
  background-color: ${props => props.theme.success};
  padding: 2px 6px;
  border-radius: 4px;
  position: absolute;
  top: 8px;
  right: 8px;
`;

const DiscountText = styled.Text`
  color: white;
  font-size: 12px;
  font-weight: bold;
`;

const GameCard = ({
  title,
  image,
  price,
  discount,
  description,
  onPress
}) => {
  const { theme } = useTheme();

  return (
    <CardContainer theme={theme} onPress={onPress}>
      <GameImage source={{ uri: image }} />
      {discount && (
        <DiscountTag theme={theme}>
          <DiscountText>-{discount}%</DiscountText>
        </DiscountTag>
      )}
      <GameInfo>
        <GameTitle theme={theme}>{title}</GameTitle>
        <GamePrice theme={theme}>{price}</GamePrice>
        {description && (
          <GameDescription theme={theme}>{description}</GameDescription>
        )}
      </GameInfo>
    </CardContainer>
  );
};

export default GameCard;