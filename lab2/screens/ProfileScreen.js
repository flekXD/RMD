import React from 'react';
import { ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '../theme/useTheme';
import Header from '../components/Header';
import ThemeToggle from '../components/ThemeToggle';

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${props => props.theme.background};
`;

const ProfileHeader = styled.View`
  align-items: center;
  padding: 30px 20px;
`;

const ProfileAvatar = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  margin-bottom: 12px;
`;

const ProfileName = styled.Text`
  color: ${props => props.theme.text};
  font-size: 22px;
  font-weight: bold;
`;

const ProfileStatus = styled.Text`
  color: ${props => props.theme.textSecondary};
  font-size: 14px;
  margin-top: 4px;
`;

const SectionTitle = styled.Text`
  color: ${props => props.theme.textSecondary};
  font-size: 14px;
  font-weight: bold;
  margin: 8px 16px;
  text-transform: uppercase;
`;

const SettingItem = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: ${props => props.theme.card};
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.divider};
`;

const SettingText = styled.Text`
  color: ${props => props.theme.text};
  font-size: 16px;
`;

const SettingIcon = styled.Text`
  color: ${props => props.theme.textSecondary};
  font-size: 16px;
`;

const ProfileScreen = () => {
  const { theme } = useTheme();

  return (
    <Container theme={theme}>
      <Header title="Profile" rightIcon="⚙️" />

      <ScrollView>
        <ProfileHeader>
          <ProfileAvatar source={{ uri: 'https://picsum.photos/200/200' }} />
          <ProfileName theme={theme}>SteamUser</ProfileName>
          <ProfileStatus theme={theme}>Online</ProfileStatus>
        </ProfileHeader>

        <SectionTitle theme={theme}>Appearance</SectionTitle>
        <ThemeToggle />

        <SectionTitle theme={theme}>Account</SectionTitle>
        <SettingItem theme={theme}>
          <SettingText theme={theme}>Privacy Settings</SettingText>
          <SettingIcon theme={theme}>›</SettingIcon>
        </SettingItem>
        <SettingItem theme={theme}>
          <SettingText theme={theme}>Notification Preferences</SettingText>
          <SettingIcon theme={theme}>›</SettingIcon>
        </SettingItem>
        <SettingItem theme={theme}>
          <SettingText theme={theme}>Payment Methods</SettingText>
          <SettingIcon theme={theme}>›</SettingIcon>
        </SettingItem>

        <SectionTitle theme={theme}>Support</SectionTitle>
        <SettingItem theme={theme}>
          <SettingText theme={theme}>Help Center</SettingText>
          <SettingIcon theme={theme}>›</SettingIcon>
        </SettingItem>
        <SettingItem theme={theme}>
          <SettingText theme={theme}>Contact Support</SettingText>
          <SettingIcon theme={theme}>›</SettingIcon>
        </SettingItem>
        <SettingItem theme={theme}>
          <SettingText theme={theme}>About</SettingText>
          <SettingIcon theme={theme}>›</SettingIcon>
        </SettingItem>
      </ScrollView>
    </Container>
  );
};

export default ProfileScreen;