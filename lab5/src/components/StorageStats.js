import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { formatBytes } from '../utils/formatting';

const StorageStats = ({ storageInfo, onRefresh, isLoading }) => {
  return (
    <View style={styles.statsContainer}>
      <Text style={styles.statsTitle}>Статистика сховища:</Text>
      <Text>Всього: {formatBytes(storageInfo.total)}</Text>
      <Text>Вільно: {formatBytes(storageInfo.free)}</Text>
      <Text>Зайнято: {formatBytes(storageInfo.used)}</Text>
      <View style={styles.refreshButtonContainer}>
          <Button
            title="Оновити статистику"
            onPress={onRefresh}
            disabled={isLoading}
          />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statsContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#e9e9e9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  refreshButtonContainer: {
    marginTop: 10,
    alignSelf: 'center',
  }
});

export default StorageStats;