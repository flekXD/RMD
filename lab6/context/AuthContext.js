import React, { createContext, useState, useEffect, useContext } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser as deleteFirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { Alert } from 'react-native';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await fetchUserProfile(firebaseUser.uid);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const fetchUserProfile = async (uid) => {
    if (!uid) return;
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      } else {
        console.log("No user profile document found!");
        setProfile(null);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      Alert.alert("Помилка", "Не вдалося завантажити профіль.");
      setProfile(null);
    }
  };

  const updateUserProfile = async (uid, data) => {
    if (!uid) return false;
    try {
      const docRef = doc(db, "users", uid);
      await setDoc(docRef, data, { merge: true });
      setProfile(data);
      Alert.alert("Успіх", "Профіль оновлено!");
      return true;
    } catch (error) {
      console.error("Error updating user profile:", error);
      Alert.alert("Помилка", "Не вдалося оновити профіль.");
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        fetchUserProfile,
        login: async (email, password) => {
          try {
            await signInWithEmailAndPassword(auth, email, password);
          } catch (e) {
            console.error("Login error:", e);
            Alert.alert("Помилка входу", e.message);
          }
        },
        register: async (email, password) => {
          try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateUserProfile(userCredential.user.uid, { name: '', age: '', city: '' });
          } catch (e) {
            console.error("Register error:", e);
            Alert.alert("Помилка реєстрації", e.message);
          }
        },
        logout: async () => {
          try {
            await signOut(auth);
          } catch (e) {
            console.error("Logout error:", e);
            Alert.alert("Помилка виходу", e.message);
          }
        },
        resetPassword: async (email) => {
            try {
                await sendPasswordResetEmail(auth, email);
                Alert.alert("Перевірте пошту", "Інструкції для скидання пароля надіслано.");
            } catch (e) {
                console.error("Password reset error:", e);
                Alert.alert("Помилка", e.message);
            }
        },
        updateProfile: async (data) => {
            if (!user) return false;
            return await updateUserProfile(user.uid, data);
        },
        deleteAccount: async (currentPassword) => {
          if (!user) return;
          try {
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);

            const userDocRef = doc(db, "users", user.uid);
            await deleteDoc(userDocRef);

            await deleteFirebaseUser(user);

            Alert.alert("Успіх", "Акаунт видалено.");
          } catch (error) {
             console.error("Delete account error:", error);
             if (error.code === 'auth/wrong-password') {
                 Alert.alert("Помилка", "Невірний поточний пароль.");
             } else if (error.code === 'auth/requires-recent-login') {
                Alert.alert("Помилка", "Потрібна нещодавня автентифікація. Спробуйте вийти та увійти знову перед видаленням.");
             } else {
                 Alert.alert("Помилка видалення", error.message);
             }
          }
        }
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};