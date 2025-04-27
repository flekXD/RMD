import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatBytes, formatDate } from '../utils/formatting';

const FileListItem = ({ item, onPressItem, onShowDetails, onDeleteItem }) => {
  const iconName = item.isDirectory
    ? 'folder'
    : item.name.endsWith('.txt')
    ? 'document-text'
    : 'document';
  const iconColor = item.isDirectory ? '#FFD700' : '#666';

  return (
    <TouchableOpacity onPress={() => onPressItem(item)} style={styles.itemContainer}>
      <View style={styles.itemContent}>
        <Ionicons name={iconName} size={24} color={iconColor} style={styles.icon} />
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemName} numberOfLines={1} ellipsizeMode="middle">
            {item.name}
          </Text>
          {!item.isDirectory && item.size !== undefined && (
            <Text style={styles.itemDetails}>Розмір: {formatBytes(item.size)}</Text>
          )}
          {/* item.modificationTime && <Text style={styles.itemDetails}>Змінено: {formatDate(item.modificationTime)}</Text> */}
        </View>
      </View>
      <View style={styles.itemActions}>
        <TouchableOpacity onPress={() => onShowDetails(item)} style={styles.actionButton}>
          <Ionicons name="information-circle-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDeleteItem(item)} style={styles.actionButton}>
          <Ionicons name="trash-outline" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 5,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  icon: {
    marginRight: 15,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemDetails: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: 15,
    padding: 5,
  },
});

export default React.memo(FileListItem);