import React, { useState } from 'react';
import { FlatList, ActivityIndicator, View, Text, TouchableOpacity, Image, ScrollView, TextInput } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '../theme/useTheme';
import Header from '../components/Header';
import { Feather } from '@expo/vector-icons';

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${props => props.theme.background};
`;

const TopBarContainer = styled.View`
  background-color: ${props => props.theme.background2};
  padding: 12px 16px;
  margin-bottom: 8px;
`;

const TopBarText = styled.Text`
  color: ${props => props.theme.textSecondary};
  font-size: 16px;
  margin-bottom: 8px;
`;

const SearchAndTabsContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 8px;
  margin-bottom: 8px;
`;

const SearchButton = styled.TouchableOpacity`
  padding: 8px;
  border-radius: 20px;
  background-color: ${props => props.theme.background3};
`;

const TabsContainer = styled.ScrollView.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  contentContainerStyle: { paddingHorizontal: 8 },
})`
  flex: 1;
  padding-vertical: 8px;
  margin-left: 8px;
`;

const TabButton = styled.TouchableOpacity`
  padding: 8px 16px;
  margin-right: 8px;
  border-radius: 20px;
  background-color: ${props => props.active ? props.theme.accent : props.theme.background3};
`;

const TabText = styled.Text`
  color: ${props => props.active ? props.theme.buttonText : props.theme.textSecondary};
  font-size: 14px;
`;

const NewsFeedCard = styled.View`
  background-color: ${props => props.theme.card};
  border-radius: 8px;
  margin: 8px 16px;
  padding: 12px;
`;

const NewsImage = styled.Image`
  width: 100%;
  height: 180px;
  border-radius: 6px;
  margin-bottom: 10px;
`;

const NewsTitle = styled.Text`
  color: ${props => props.theme.text};
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 6px;
`;

const NewsDescription = styled.Text`
  color: ${props => props.theme.textSecondary};
  font-size: 14px;
  margin-bottom: 10px;
`;

const ActionsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: 8px;
  border-top-width: 1px;
  border-top-color: ${props => props.theme.border};
`;

const LeftActions = styled.View`
  flex-direction: row;
`;

const ActionButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-right: 16px;
`;

const ActionText = styled.Text`
  color: ${props => props.theme.textSecondary};
  margin-left: 4px;
  font-size: 12px;
`;

const LoadingContainer = styled.View`
  padding: 20px;
  align-items: center;
`;

const initialNews = [
  {
    id: '1',
    title: 'Cyberpunk 2077: Phantom Liberty Release Date Announced',
    image: 'https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg?t=1686158991',
    description: 'CD Projekt Red reveals the launch date for the highly anticipated Cyberpunk 2077 expansion.',
    likes: 235,
    comments: 48,
  },
  {
    id: '2',
    title: 'The Last of Us Part III in Development?',
    image: 'https://image.api.playstation.com/vulcan/ap/rnd/202210/0420/633c2999495fc9569148284d/original.png',
    description: 'Rumors and speculation arise about the potential third installment in the acclaimed The Last of Us series.',
    likes: 187,
    comments: 32,
  },
  {
    id: '3',
    title: 'Indie Game Spotlight: Stardew Valley Update',
    image: 'https://cdn.akamai.steamstatic.com/steam/apps/413150/header.jpg?t=1671445485',
    description: 'Chucklefish releases a new content update for the beloved farming simulator Stardew Valley.',
    likes: 312,
    comments: 65,
  },
  {
    id: '4',
    title: 'New Gameplay Trailer for Elden Ring DLC',
    image: 'https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg?t=1674033559',
    description: 'FromSoftware unveils a thrilling gameplay trailer for the upcoming Shadow of the Erdtree DLC for Elden Ring.',
    likes: 289,
    comments: 51,
  },
  {
    id: '5',
    title: 'Valorant Champions Tour 2024 Announced',
    image: 'https://playvalorant.com/static/ee7c9a99a59106238d1a4945185fde53/valorant-champions-tour-logo.png',
    description: 'Riot Games announces the schedule and locations for the Valorant Champions Tour 2024.',
    likes: 163,
    comments: 28,
  },
];

const CommunityScreen = () => {
  const { theme } = useTheme();
  const [news, setNews] = useState(initialNews);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const tabs = [
    { id: 'all', name: 'All' },
    { id: 'news', name: 'News' },
    { id: 'screenshots', name: 'Screenshots' },
    { id: 'artwork', name: 'Artwork' },
    { id: 'videos', name: 'Videos' },
    { id: 'guides', name: 'Guides' },
    { id: 'discussions', name: 'Discussions' },
  ];

  const handleLike = (id) => {
    setNews(prevNews =>
      prevNews.map(item =>
        item.id === id ? { ...item, likes: item.likes + 1 } : item
      )
    );
  };

  const handleComment = (id) => {
    console.log(`Перейти до коментарів для новини ${id}`);
  };

  const handleShare = (id) => {
    console.log(`Поширити новину ${id}`);
    // Тут можна додати логіку для поширення
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const renderNewsItem = ({ item }) => (
    <NewsFeedCard theme={theme}>
      <NewsImage source={{ uri: item.image }} />
      <NewsTitle theme={theme}>{item.title}</NewsTitle>
      <NewsDescription theme={theme}>{item.description}</NewsDescription>
      <ActionsContainer theme={theme}>
        <LeftActions>
          <ActionButton onPress={() => handleLike(item.id)}>
            <Feather name="thumbs-up" size={16} color={theme.textSecondary} />
            <ActionText theme={theme}>{item.likes}</ActionText>
          </ActionButton>
          <ActionButton onPress={() => handleComment(item.id)}>
            <Feather name="message-square" size={16} color={theme.textSecondary} />
            <ActionText theme={theme}>{item.comments}</ActionText>
          </ActionButton>
        </LeftActions>
        <TouchableOpacity onPress={() => handleShare(item.id)}>
          <Feather name="share" size={16} color={theme.textSecondary} />
        </TouchableOpacity>
      </ActionsContainer>
    </NewsFeedCard>
  );

  const renderFooter = () => {
    if (!loading) return null;

    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color={theme.accent} />
      </LoadingContainer>
    );
  };

  return (
    <Container theme={theme}>
      <Header title="Community" />
      <TopBarContainer theme={theme}>
        <TopBarText theme={theme}>Community and official content for all games and software</TopBarText>
        <SearchAndTabsContainer>
          <SearchButton onPress={toggleSearch}>
            <Feather name="search" size={20} color={theme.textSecondary} />
          </SearchButton>
          <TabsContainer>
            {tabs.map(tab => (
              <TabButton
                key={tab.id}
                active={activeTab === tab.id}
                theme={theme}
                onPress={() => setActiveTab(tab.id)}
              >
                <TabText active={activeTab === tab.id} theme={theme}>
                  {tab.name}
                </TabText>
              </TabButton>
            ))}
          </TabsContainer>
        </SearchAndTabsContainer>
        {isSearchVisible && (
          <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
            <TextInput
              style={{
                backgroundColor: theme.card,
                borderRadius: 20,
                padding: 8,
                paddingLeft: 16,
                color: theme.text,
                fontSize: 16,
              }}
              placeholder="Search community..."
              placeholderTextColor={theme.textSecondary}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        )}
      </TopBarContainer>
      <FlatList
        data={news}
        keyExtractor={(item) => item.id}
        renderItem={renderNewsItem}
        ListFooterComponent={renderFooter}
      />
    </Container>
  );
};

export default CommunityScreen;