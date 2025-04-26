import React, { createContext, useState, useContext, useMemo, useCallback } from 'react';

const GameContext = createContext();

// Список завдань
const initialTasks = [
  { id: '1', text: 'Зробити 10 кліків', target: 10, progress: 0, type: 'clicks', completed: false },
  { id: '2', text: 'Зробити подвійний клік 5 разів', target: 5, progress: 0, type: 'double_taps', completed: false },
  { id: '3', text: 'Утримувати об\'єкт 3 секунди (хоча б раз)', target: 1, progress: 0, type: 'long_press', completed: false },
  { id: '4', text: 'Перетягнути об\'єкт (хоча б раз)', target: 1, progress: 0, type: 'pan', completed: false },
  { id: '5', text: 'Зробити свайп вправо (хоча б раз)', target: 1, progress: 0, type: 'fling_right', completed: false },
  { id: '6', text: 'Зробити свайп вліво (хоча б раз)', target: 1, progress: 0, type: 'fling_left', completed: false },
  { id: '7', text: 'Змінити розмір об\'єкта (хоча б раз)', target: 1, progress: 0, type: 'pinch', completed: false },
  { id: '8', text: 'Отримати 100 очок', target: 100, progress: 0, type: 'score', completed: false },
];

export const GameProvider = ({ children }) => {
  const [score, setScore] = useState(0);
  const [tasks, setTasks] = useState(initialTasks);

  const updateTaskProgress = useCallback((type, increment = 1) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        // Спеціальна логіка для завдання на рахунок
        if (type === 'score') {
          if (task.type === 'score' && !task.completed) {
             // Передаємо поточний рахунок як прогрес
            const currentScore = score + increment; // Потенційний новий рахунок
            const newProgress = Math.min(currentScore, task.target);
            return {
              ...task,
              progress: newProgress,
              completed: newProgress >= task.target,
            };
          }
          return task; // Не змінюємо інші завдання
        }

        // Логіка для інших завдань
        if (task.type === type && !task.completed) {
          const newProgress = Math.min(task.progress + increment, task.target);
          return {
            ...task,
            progress: newProgress,
            completed: newProgress >= task.target,
          };
        }
        return task;
      })
    );
  }, [score]); // Додаємо score як залежність для оновлення завдання на рахунок

  const addScore = useCallback((points) => {
      const newScore = score + points;
      setScore(newScore);
      // Оновлюємо прогрес для завдання на рахунок
      updateTaskProgress('score', points); // Передаємо points щоб правильно порахувати
  }, [score, updateTaskProgress]);


  const value = useMemo(() => ({
    score,
    tasks,
    addScore,
    updateTaskProgress,
  }), [score, tasks, addScore, updateTaskProgress]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};