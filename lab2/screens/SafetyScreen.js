import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ScrollView, View, Text, Animated, Easing, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '../theme/useTheme';
import Header from '../components/Header';



const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${props => props.theme.background ?? '#1b2838'};
`;

const ContentContainer = styled.View`
  flex: 1;
  align-items: center;
  padding: 20px;
`;

const AuthCodeContainer = styled.View`
  align-items: center;
  margin-top: 40px; /* Більший відступ зверху */
  margin-bottom: 20px;
`;

const AuthCodeText = styled.Text`
  color: ${props => props.theme.text ?? '#ffffff'};
  font-size: 56px; /* Значно більший розмір коду */
  font-weight: bold;
  letter-spacing: 8px; /* Більший проміжок між літерами */
  font-family: 'monospace'; /* Моноширинний шрифт для коду */
  text-align: center;
`;

const ProgressBarContainer = styled.View`
  width: 60%; /* Зробимо смужку ширшою */
  height: 8px; /* Трохи товща */
  background-color: ${props => props.theme.card ?? '#2a475e'}; /* Темніший фон для смужки */
  border-radius: 4px;
  overflow: hidden; /* Важливо для заокруглення */
  margin-top: 10px; /* Відступ від коду */
  margin-bottom: 30px; /* Відступ до тексту */
`;

const ProgressBarFill = styled(Animated.View)`
  height: 100%;
  background-color: ${props => props.theme.accent ?? '#66c0f4'}; /* Світло-синій акцент Steam */
  border-radius: 4px;
`;

const InfoText = styled.Text`
  color: ${props => props.theme.textSecondary ?? '#c7d5e0'}; /* Світліший сірий */
  font-size: 15px;
  text-align: center;
  line-height: 22px;
  margin-bottom: 40px; /* Відступ до опцій */
  padding: 0 10px; /* Невеликі бічні відступи */
`;

const OptionsContainer = styled.View`
  width: 100%;
  background-color: ${props => props.theme.card ?? '#2a475e'}; /* Фон для опцій */
  border-radius: 8px;
  margin-top: 20px;
`;

const OptionItem = styled.TouchableOpacity`
  padding: 18px 20px;
  border-bottom-width: ${props => (props.isLast ? 0 : '1px')};
  border-bottom-color: ${props => props.theme.background ?? '#1b2838'}; /* Колір роздільника */
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const OptionText = styled.Text`
  color: ${props => props.theme.text ?? '#ffffff'};
  font-size: 16px;
`;

const ChevronText = styled.Text`
  color: ${props => props.theme.textSecondary ?? '#c7d5e0'};
  font-size: 18px;
`;

// --- Компонент ---

const CODE_DURATION_SECONDS = 30; // Тривалість дії коду в секундах
const CODE_LENGTH = 5; // Довжина коду

const generateCode = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const SteamGuardScreen = () => {
  const themeContext = useTheme ? useTheme() : { theme: {} };
  const theme = themeContext.theme || {};

  const [authCode, setAuthCode] = useState('');
  const progressAnim = useRef(new Animated.Value(0)).current;
  const intervalRef = useRef(null);

  const startProgressAnimation = useCallback(() => {
    progressAnim.setValue(0);
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: CODE_DURATION_SECONDS * 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [progressAnim]);

  const refreshCodeAndProgress = useCallback(() => {
    setAuthCode(generateCode(CODE_LENGTH));
    startProgressAnimation();
  }, [startProgressAnimation]);

  useEffect(() => {
    refreshCodeAndProgress();
    intervalRef.current = setInterval(() => {
      refreshCodeAndProgress();
    }, CODE_DURATION_SECONDS * 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      progressAnim.stopAnimation();
    };
  }, [refreshCodeAndProgress, progressAnim]);

  const progressBarStyle = {
    width: progressAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    }),
  };

  return (
    <Container theme={theme}>
      <Header title="Steam Guard" rightIcon="" />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ContentContainer>
          <Text style={{ color: theme.textSecondary ?? '#c7d5e0', marginBottom: 5 }}>
            Logged in as player {/* Можна замінити */}
          </Text>

          <AuthCodeContainer>
            <AuthCodeText theme={theme}>{authCode}</AuthCodeText>
            <ProgressBarContainer theme={theme}>
              <ProgressBarFill theme={theme} style={progressBarStyle} />
            </ProgressBarContainer>
          </AuthCodeContainer>

          <InfoText theme={theme}>
            You'll enter your code each time you enter your password to sign in to your Steam account.
          </InfoText>
          <InfoText theme={theme} style={{ fontStyle: 'italic', marginTop: -25, marginBottom: 30 }}>
            Tip: If you don't share your PC, you can select "Remember my password" when you sign in to the PC client to enter your password and authenticator code less often.
          </InfoText>

          <OptionsContainer theme={theme}>
            <OptionItem theme={theme} onPress={() => console.log('Remove Authenticator pressed')}>
              <OptionText theme={theme}>Remove Authenticator</OptionText>
              <ChevronText theme={theme}>&gt;</ChevronText>
            </OptionItem>
            <OptionItem theme={theme} onPress={() => console.log('My Recovery Code pressed')}>
              <OptionText theme={theme}>My Recovery Code</OptionText>
              <ChevronText theme={theme}>&gt;</ChevronText>
            </OptionItem>
            <OptionItem theme={theme} isLast onPress={() => console.log('Help pressed')}>
              <OptionText theme={theme}>Help</OptionText>
              <ChevronText theme={theme}>&gt;</ChevronText>
            </OptionItem>
          </OptionsContainer>

        </ContentContainer>
      </ScrollView>
    </Container>
  );
};


export default SteamGuardScreen;