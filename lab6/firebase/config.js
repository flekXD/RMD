import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Ваша конфігурація Firebase з консолі
const firebaseConfig = {
  apiKey: "AIzaSyCBGmTa4vESPoaPm6mtVF7oQe9yPwIdqKQ",
  authDomain: "lab6-7902c.firebaseapp.com",
  projectId: "lab6-7902c",
  storageBucket: "lab6-7902c.firebasestorage.app",
  messagingSenderId: "817652214274",
  appId: "1:817652214274:web:1e2a79f8c70764243e951b",
  measurementId: "G-G2JRSDEVHY"
};

// Ініціалізація Firebase
const app = initializeApp(firebaseConfig);

// Ініціалізація Auth з persistence
// Це дозволяє Firebase автоматично зберігати сесію користувача
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Ініціалізація Firestore
const db = getFirestore(app);

export { auth, db };