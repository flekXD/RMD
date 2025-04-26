import React from 'react';
import styled from 'styled-components/native';
import { useTheme } from '../theme/useTheme';

const ItemContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 12px 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.divider};
`;

const Avatar = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin-right: 12px;
`;

const UnknownAvatar = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin-right: 12px;
  background-color: ${props => props.theme.divider};
  justify-content: center;
  align-items: center;
`;

const UnknownIcon = styled.Text`
  color: ${props => props.theme.textSecondary};
  font-size: 24px;
`;

const InfoContainer = styled.View`
  flex: 1;
`;

const TopRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 4px;
`;

const UserName = styled.Text`
  color: ${props => props.theme.text};
  font-weight: bold;
  font-size: 14px;
`;

const TimeStamp = styled.Text`
  color: ${props => props.theme.textSecondary};
  font-size: 12px;
`;

const LastMessage = styled.Text`
  color: ${props => props.theme.textSecondary};
  font-size: 13px;
`;

const StatusIndicator = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${props => props.online ? '#4CAF50' : props.theme.textSecondary};
  position: absolute;
  bottom: 0;
  right: 12px;
`;

const ChatItem = ({
  name,
  avatar,
  lastMessage,
  time,
  online,
  unknown,
  onPress
}) => {
  const { theme } = useTheme();

  return (
    <ItemContainer theme={theme} onPress={onPress}>
      {unknown ? (
        <UnknownAvatar theme={theme}>
          <UnknownIcon theme={theme}>?</UnknownIcon>
        </UnknownAvatar>
      ) : (
        <>
          <Avatar source={{ uri: avatar }} />
          {online !== undefined && <StatusIndicator theme={theme} online={online} />}
        </>
      )}
      <InfoContainer>
        <TopRow>
          <UserName theme={theme}>{name}</UserName>
          <TimeStamp theme={theme}>{time}</TimeStamp>
        </TopRow>
        <LastMessage theme={theme} numberOfLines={1}>{lastMessage}</LastMessage>
      </InfoContainer>
    </ItemContainer>
  );
};

export default ChatItem;