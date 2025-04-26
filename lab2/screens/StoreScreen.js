import React, { useState } from 'react';
import { FlatList, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '../theme/useTheme';
import Header from '../components/Header';
import GameCard from '../components/GameCard';

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

const SectionTitle = styled.Text`
  color: ${props => props.theme.text};
  font-size: 18px;
  font-weight: bold;
  margin: 16px 16px 8px 16px;
`;

const LoadingContainer = styled.View`
  padding: 20px;
  align-items: center;
`;

// Banner styling
const FeaturedBanner = styled.TouchableOpacity`
  margin: 8px 16px;
  border-radius: 8px;
  overflow: hidden;
  height: 200px;
`;

const BannerImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const BannerOverlay = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background-color: rgba(0, 0, 0, 0.6);
`;

const BannerTitle = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: bold;
`;

const BannerSubtitle = styled.Text`
  color: #cccccc;
  font-size: 14px;
`;

const PriceContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 4px;
`;

const DiscountTag = styled.View`
  background-color: ${props => props.theme.success};
  padding: 2px 6px;
  border-radius: 4px;
  margin-right: 8px;
`;

const DiscountText = styled.Text`
  color: white;
  font-size: 12px;
  font-weight: bold;
`;

const OriginalPrice = styled.Text`
  color: #999999;
  font-size: 14px;
  text-decoration-line: line-through;
  margin-right: 8px;
`;

const SalePrice = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

// Category tabs
const CategoriesContainer = styled.View`
  margin: 8px 0;
`;

const CategoryTab = styled.TouchableOpacity`
  background-color: ${props => props.isActive ? props.theme.accent : props.theme.background2};
  padding: 8px 16px;
  border-radius: 20px;
  margin-horizontal: 6px;
`;

const CategoryText = styled.Text`
  color: ${props => props.isActive ? 'white' : props.theme.textSecondary};
  font-weight: ${props => props.isActive ? 'bold' : 'normal'};
`;

// Compact game item styling - updated for square thumbnails
const GameItemContainer = styled.TouchableOpacity`
  flex-direction: row;
  background-color: ${props => props.theme.card};
  margin: 6px 16px;
  border-radius: 8px;
  overflow: hidden;
`;

const GameItemImageContainer = styled.View`
  width: 80px;
  height: 80px;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  background-color: #000;
`;

const GameItemImage = styled.Image`
  width: 80px;
  height: 80px;
`;

const GameItemDetails = styled.View`
  flex: 1;
  padding: 10px;
  justify-content: center;
`;

const GameItemTitle = styled.Text`
  color: ${props => props.theme.text};
  font-weight: bold;
  font-size: 14px;
`;

const GameItemPlatform = styled.Text`
  color: ${props => props.theme.textSecondary};
  font-size: 12px;
  margin-top: 2px;
`;

const GameItemPrice = styled.Text`
  color: ${props => props.theme.text};
  font-size: 14px;
  font-weight: bold;
  margin-top: 4px;
`;

const GameItemPriceDiscount = styled.View`
  background-color: ${props => props.theme.success};
  padding: 2px 6px;
  border-radius: 4px;
  position: absolute;
  bottom: 10px;
  right: 10px;
`;

// Actual game data with square thumbnail images
const actualGames = [
  {
    id: '1', // Featured Game
    title: 'Dead by Daylight',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/381210/capsule_184x69.jpg', // Rectangular small image
    bannerImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/381210/header.jpg', // Banner remains
    price: '$5', // Sale price from image
    originalPrice: '$18', // Original price from image
    discount: 70, // Discount from image
    description: 'Multiplayer horror game with 1v4 gameplay',
    platforms: ['Windows']
  },
  {
    id: '2',
    title: 'Grand Theft Auto V',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/271590/capsule_184x69.jpg', // Rectangular small image
    bannerImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg',
    price: '$10', // Sale price from image
    originalPrice: '$20', // Original price from image
    discount: 50, // Discount from image
    description: 'Open world action game',
    platforms: ['Windows']
  },
  {
    id: '3',
    title: 'Battlefield 4™', // Added TM
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1238860/capsule_184x69.jpg', // Rectangular small image
    bannerImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1238860/header.jpg',
    price: '$35', // Price from image
    description: 'First-person shooter set in the near future',
    platforms: ['Windows']
  },
  {
    id: '4',
    title: 'Factorio',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/427520/capsule_184x69.jpg', // Rectangular small image
    bannerImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/427520/header.jpg',
    price: '$7', // Price from image
    description: 'Factory building simulation game',
    platforms: ['Windows', 'Mac']
  },
  {
    id: '5',
    title: 'Horizon Zero Dawn',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1151640/capsule_184x69.jpg', // Rectangular small image
    bannerImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1151640/header.jpg',
    price: '$38', // Price from image
    description: 'Action RPG in a post-apocalyptic world',
    platforms: ['Windows']
  },
];

// Categories
const categories = [
  { id: '1', name: 'Top Sellers' },
  { id: '2', name: 'Free to play' },
  { id: '3', name: 'Early Access' },
  { id: '4', name: 'Action' },
  { id: '5', name: 'Adventure' },
  { id: '6', name: 'RPG' },
];

const StoreScreen = () => {
  // Get theme from context
  const { theme } = useTheme();
  const [games, setGames] = useState(actualGames);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('1');

  const renderFeaturedBanner = () => {
    const featuredGame = games[0]; // Using the first game as featured

    return (
      <FeaturedBanner>
        <BannerImage
          source={{ uri: featuredGame.bannerImage || featuredGame.image }}
          resizeMode="cover"
        />
        <BannerOverlay>
          <BannerTitle>{featuredGame.title}</BannerTitle>
          <BannerSubtitle>Recommended by your friend, Player</BannerSubtitle>
          <PriceContainer>
            {featuredGame.discount && (
              <DiscountTag theme={theme}>
                <DiscountText>-{featuredGame.discount}%</DiscountText>
              </DiscountTag>
            )}
            {featuredGame.originalPrice && (
              <OriginalPrice>{featuredGame.originalPrice}</OriginalPrice>
            )}
            <SalePrice>{featuredGame.price}</SalePrice>
          </PriceContainer>
        </BannerOverlay>
      </FeaturedBanner>
    );
  };

  const renderCategories = () => {
    return (
      <CategoriesContainer>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10 }}
        >
          {categories.map(category => (
            <CategoryTab
              key={category.id}
              isActive={activeCategory === category.id}
              theme={theme}
              onPress={() => setActiveCategory(category.id)}
            >
              <CategoryText isActive={activeCategory === category.id} theme={theme}>
                {category.name}
              </CategoryText>
            </CategoryTab>
          ))}
        </ScrollView>
      </CategoriesContainer>
    );
  };

  const renderGameItem = ({ item }) => {
    return (
      <GameItemContainer theme={theme}>
        <GameItemImageContainer>
          <GameItemImage
            source={{ uri: item.image }}
            resizeMode="cover"
          />
        </GameItemImageContainer>
        <GameItemDetails>
          <GameItemTitle theme={theme}>{item.title}</GameItemTitle>
          <GameItemPlatform theme={theme}>
            {item.platforms.map(platform => `${platform}`).join(', ')}
          </GameItemPlatform>
          <GameItemPrice theme={theme}>{item.price}</GameItemPrice>
        </GameItemDetails>
        {item.discount && (
          <GameItemPriceDiscount theme={theme}>
            <DiscountText>-{item.discount}%</DiscountText>
          </GameItemPriceDiscount>
        )}
      </GameItemContainer>
    );
  };

  // Filter games based on search query
  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Make sure theme is available before rendering
  if (!theme) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color="#66c0f4" />
      </LoadingContainer>
    );
  }

  return (
    <Container theme={theme}>
      <Header title="Store" rightIcon="🔍" />

      <SearchBar
        theme={theme}
        placeholder="Search games..."
        placeholderTextColor={theme.textSecondary}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredGames}
        keyExtractor={(item) => item.id}
        renderItem={renderGameItem}
        ListHeaderComponent={
          <>
            {renderFeaturedBanner()}
            {renderCategories()}
          </>
        }
      />
    </Container>
  );
};

export default StoreScreen;