import React, { useState } from 'react';
import { FlatList, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '../theme/useTheme';
import Header from '../components/Header';
import ChatItem from '../components/ChatItem';

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${props => props.theme.background};
`;

const SearchBar = styled.TextInput`
  background-color: ${props => props.theme.background2};
  color: ${props => props.theme.text};
  padding: 10px 16px;
  border-radius: 4px;
  margin: 8px 16px;
`;

const SectionHeader = styled.Text`
  color: ${props => props.theme.textSecondary};
  font-size: 12px;
  font-weight: bold;
  padding: 8px 16px;
  background-color: ${props => props.theme.background2};
`;

const LoadingContainer = styled.View`
  padding: 20px;
  align-items: center;
`;

// Sample chat data
const initialChats = [
  {
    id: '1',
    name: 'Mark Green',
    avatar: 'https://picsum.photos/200/200',
    lastMessage: 'Are you online? Want to play some CS?',
    time: '12:35 PM',
    online: true,
  },
  {
    id: '2',
    name: 'Jessica',
    avatar: 'https://picsum.photos/200/201',
    lastMessage: 'I just got that game you recommended!',
    time: '11:20 AM',
    online: false,
  },
  {
    id: '3',
    name: 'Group: Squad 12',
    avatar: 'https://picsum.photos/200/202',
    lastMessage: 'Alex: Are we playing tonight?',
    time: 'Yesterday',
    online: false,
  },
  {
    id: '4',
    name: 'Player123',
    avatar: 'https://picsum.photos/200/203',
    lastMessage: 'Thanks for the trade!',
    time: '2 days ago',
    online: false,
  },
  {
    id: '5',
    name: 'Unknown_Player_1',
    avatar: null,
    lastMessage: 'Friend request pending',
    time: '3 days ago',
    unknown: true,
  },
  {
    id: '6',
    name: 'Unknown_Player_2',
    avatar: null,
    lastMessage: 'Friend request pending',
    time: '5 days ago',
    unknown: true,
  },
];

const generateMoreChats = (startId) => {
    const moreChats = [];
    for (let i = 0; i < 5; i++) {
      const id = String(parseInt(startId) + i);
      const isUnknown = Math.random() > 0.7;

      moreChats.push({
        id,
        name: isUnknown ? `Unknown_Player_${id}` : `Player${id}`,
        avatar: isUnknown ? null : `https://picsum.photos/200/${200 + parseInt(id)}`,
        lastMessage: isUnknown ? 'Friend request pending' : `This is message ${id}. Let's play some games!`,
        time: Math.random() > 0.5 ? 'Yesterday' : `${Math.floor(Math.random() * 10)} days ago`,
        online: Math.random() > 0.8,
        unknown: isUnknown,
      });
    }
    return moreChats;
  };

  const ChatScreen = () => {
    const { theme } = useTheme();
    const [chats, setChats] = useState(initialChats);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const loadMoreChats = () => {
      if (loading) return;

      setLoading(true);

      // Simulate API call with setTimeout
      setTimeout(() => {
        const newChats = generateMoreChats(chats.length + 1);
        setChats([...chats, ...newChats]);
        setLoading(false);
      }, 1000);
    };

    const renderFooter = () => {
      if (!loading) return null;

      return (
        <LoadingContainer>
          <ActivityIndicator size="large" color={theme.accent} />
        </LoadingContainer>
      );
    };

    // Group chats by online status
    const onlineChats = chats.filter(chat => chat.online);
    const offlineChats = chats.filter(chat => !chat.online && !chat.unknown);
    const unknownChats = chats.filter(chat => chat.unknown);

    // Combine into sections with headers
    const sections = [
      { title: 'Online', data: onlineChats },
      { title: 'Offline', data: offlineChats },
      { title: 'Friend Requests', data: unknownChats },
    ];

    // Filter sections if there's a search query
    const filteredSections = searchQuery
      ? sections.map(section => ({
          ...section,
          data: section.data.filter(chat =>
            chat.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        })).filter(section => section.data.length > 0)
      : sections;

    return (
      <Container theme={theme}>
        <Header title="Chat" rightIcon="+" />

        <SearchBar
          theme={theme}
          placeholder="Search friends..."
          placeholderTextColor={theme.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <FlatList
          data={[...filteredSections[0]?.data || [], ...filteredSections[1]?.data || [], ...filteredSections[2]?.data || []]}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatItem
              name={item.name}
              avatar={item.avatar}
              lastMessage={item.lastMessage}
              time={item.time}
              online={item.online}
              unknown={item.unknown}
            />
          )}
          onEndReached={loadMoreChats}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListHeaderComponent={() => (
            <>
              {filteredSections[0]?.data.length > 0 && (
                <SectionHeader theme={theme}>ONLINE</SectionHeader>
              )}
            </>
          )}
        />
      </Container>
    );
  };

  export default ChatScreen;