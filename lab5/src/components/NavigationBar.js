import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { APP_DATA_DIR_NAME } from '../constants/fileSystem';

const NavigationBar = ({ currentPath, onNavigateUp, isLoading }) => {
  const displayPath = `/${APP_DATA_DIR_NAME}/${currentPath}`;
  const canNavigateUp = currentPath !== '';

  return (
    <View style={styles.navigationHeader}>
      {canNavigateUp && (
        <TouchableOpacity
          onPress={onNavigateUp}
          style={styles.navButton}
          disabled={isLoading}
        >
          <Ionicons
            name="arrow-up-circle"
            size={30}
            color={isLoading ? '#aaa' : '#007AFF'}
           />
          <Text style={[styles.navButtonText, isLoading && styles.disabledText]}>
            Вгору
          </Text>
        </TouchableOpacity>
      )}
      <Text
        style={styles.currentPathText}
        numberOfLines={1}
        ellipsizeMode="head"
      >
        {displayPath}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  navigationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 5,
    paddingVertical: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    minHeight: 46,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    padding: 5,
  },
  navButtonText: {
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 3,
  },
  currentPathText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginLeft: 5,
  },
  disabledText: {
    color: '#aaa'
  }
});

export default NavigationBar;