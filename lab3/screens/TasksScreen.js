import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { useGame } from '../contexts/GameContext'; // Імпорт контексту

export default function TasksScreen() {
  const { tasks } = useGame(); // Отримуємо список завдань з контексту

  const renderItem = ({ item }) => (
    <View style={[styles.taskItem, item.completed ? styles.taskItemCompleted : {}]}>
      <Text style={styles.taskText}>{item.text}</Text>
      <Text style={styles.taskStatus}>
        {item.completed ? '✅ Виконано' : `⏳ ${item.progress}/${item.target}`}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Завдання</Text>
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fa', // Світлий фон
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  listContainer: {
    paddingBottom: 20,
  },
  taskItem: {
    backgroundColor: '#ffffff', // Білий фон для елементів
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row', // Розміщення тексту та статусу в рядок
    justifyContent: 'space-between', // Розподіл простору
    alignItems: 'center', // Вирівнювання по центру
    borderWidth: 1,
    borderColor: '#ddd', // Легка рамка
  },
  taskItemCompleted: {
    backgroundColor: '#d4edda', // Зеленуватий фон для виконаних
    borderColor: '#c3e6cb',
  },
  taskText: {
    fontSize: 16,
    flex: 1, // Дозволяє тексту займати доступний простір
    marginRight: 10,
    color: '#555',
  },
  taskStatus: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6c757d', // Сірий колір для статусу
  },
});