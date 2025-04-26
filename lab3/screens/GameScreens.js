import React, { useRef } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView, // Імпортуйте тут якщо App.js ще не обгорнутий
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useGame } from '../contexts/GameContext'; // Імпорт контексту

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const OBJECT_SIZE = 100;
const BONUS_POINTS_LONG_PRESS = 10;
const LONG_PRESS_DURATION_MS = 1500; // 1.5 секунди для лонг пресу
const DOUBLE_TAP_POINTS = 2;
const SINGLE_TAP_POINTS = 1;


export default function GameScreen() {
  const { score, addScore, updateTaskProgress } = useGame(); // Використання контексту

  // --- Анімаційні значення ---
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const objectColor = useSharedValue('#3498db'); // Початковий колір

  // --- Обробники жестів ---

  // Коротке натискання (Tap)
  const singleTap = Gesture.Tap()
    .numberOfTaps(1)
    .maxDuration(250) // Важливо для розрізнення з doubleTap
    .onEnd((_event, success) => {
      if (success) {
        // Виконуємо оновлення стану в JS потоці
        runOnJS(addScore)(SINGLE_TAP_POINTS);
        runOnJS(updateTaskProgress)('clicks');
        // Анімація кольору
        objectColor.value = withTiming('#2ecc71', { duration: 100 }, (finished) => {
            if (finished) {
                objectColor.value = withTiming('#3498db', {duration: 200});
            }
        });
      }
    });

  // Подвійне натискання (Double Tap)
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd((_event, success) => {
      if (success) {
        runOnJS(addScore)(DOUBLE_TAP_POINTS);
        runOnJS(updateTaskProgress)('double_taps');
         objectColor.value = withTiming('#f1c40f', { duration: 100 }, (finished) => {
            if (finished) {
                objectColor.value = withTiming('#3498db', {duration: 200});
            }
        });
      }
    });

  // Довге натискання (Long Press)
  const longPress = Gesture.LongPress()
    .minDuration(LONG_PRESS_DURATION_MS)
    .onStart(() => {
        objectColor.value = withTiming('#e74c3c', { duration: LONG_PRESS_DURATION_MS });
    })
    .onEnd((_event, success) => {
      if (success) {
        runOnJS(addScore)(BONUS_POINTS_LONG_PRESS);
        runOnJS(updateTaskProgress)('long_press');
      }
      // Повертаємо колір незалежно від успіху, якщо жест закінчився
       objectColor.value = withTiming('#3498db', {duration: 200});
    });

  // Перетягування (Pan)
  const pan = Gesture.Pan()
    .averageTouches(true)
    .onChange((event) => {
      translateX.value += event.changeX;
      translateY.value += event.changeY;
    })
    .onEnd(() => {
      // Обмеження виходу за екран (простий варіант)
       const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
       const boundX = screenWidth / 2 - (OBJECT_SIZE * scale.value) / 2;
       const boundY = screenHeight / 2 - (OBJECT_SIZE * scale.value) / 2 - 100; // Приблизна корекція на UI зверху/знизу

       translateX.value = withSpring(clamp(translateX.value, -boundX, boundX));
       translateY.value = withSpring(clamp(translateY.value, -boundY, boundY));

      runOnJS(updateTaskProgress)('pan'); // Зараховуємо завдання при відпусканні
    });

  // Свайп (Fling) - обробка напрямку
  const fling = Gesture.Fling()
    .direction(1 | 2) // Directions.RIGHT | Directions.LEFT (1 = right, 2 = left)
    .onEnd((event) => {
      const randomPoints = Math.floor(Math.random() * 10) + 1; // 1-10 очок
      if (event.x > 0) { // Свайп вправо
         runOnJS(addScore)(randomPoints);
         runOnJS(updateTaskProgress)('fling_right');
         console.log('Fling Right! Points:', randomPoints);
      } else { // Свайп вліво
         runOnJS(addScore)(randomPoints);
         runOnJS(updateTaskProgress)('fling_left');
         console.log('Fling Left! Points:', randomPoints);
      }
       objectColor.value = withTiming('#9b59b6', { duration: 100 }, (finished) => {
            if (finished) {
                objectColor.value = withTiming('#3498db', {duration: 200});
            }
        });
    });


  // Масштабування (Pinch)
  const pinch = Gesture.Pinch()
    .onUpdate((event) => {
        // Обмежуємо масштаб, щоб не зникав і не ставав надто великим
        const newScale = Math.max(0.5, Math.min(savedScale.value * event.scale, 3));
        scale.value = newScale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      // Додаємо бонусні очки за сам факт масштабування (наприклад)
      const bonusPinchPoints = 5;
      runOnJS(addScore)(bonusPinchPoints);
      runOnJS(updateTaskProgress)('pinch');
    });

  // --- Комбінування жестів ---
  // Race: Виконується тільки один жест з групи (корисний для tap vs double tap)
  // Simultaneous: Дозволяє виконувати жести одночасно (pan + pinch)
  const composedTap = Gesture.Exclusive(doubleTap, singleTap); // Пріоритет у doubleTap
  const composedAll = Gesture.Simultaneous(pan, pinch, Gesture.Race(longPress, fling, composedTap));

  // --- Анімовані стилі ---
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    backgroundColor: objectColor.value, // Анімація кольору
  }));

  return (
    // <GestureHandlerRootView style={styles.flexOne}> // Розкоментуйте, якщо App.js не обгорнутий
      <View style={styles.container}>
        <Text style={styles.scoreText}>Рахунок: {score}</Text>
        <View style={styles.gameArea}>
          <GestureDetector gesture={composedAll}>
            <Animated.View style={[styles.interactiveObject, animatedStyle]} />
          </GestureDetector>
        </View>
      </View>
   // </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
 flexOne: { // Якщо використовуєте GestureHandlerRootView тут
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start', // Розміщуємо рахунок зверху
    paddingTop: 50, // Відступ зверху
  },
  scoreText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40, // Відступ після рахунку
    color: '#333',
  },
   gameArea: { // Область для центрування об'єкта спочатку
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
   // backgroundColor: '#eee', // Для візуалізації області
  },
  interactiveObject: {
    width: OBJECT_SIZE,
    height: OBJECT_SIZE,
    borderRadius: OBJECT_SIZE / 2, // Робимо круглим
    backgroundColor: '#3498db', // Початковий колір (буде перезаписаний анімацією)
    cursor: 'pointer', // Для веб версії
    alignItems: 'center',
    justifyContent: 'center',
     shadowColor: "#000", // Тінь для кращої візуалізації
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});