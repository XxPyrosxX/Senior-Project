import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from './pages/HomePage';
import CreateAccount from './pages/CreateAccount';
import ForgotPassword from './pages/ForgotPassword';
import TabsLayout from './insideLayout';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from '@/FirebaseConfig';
import { scheduleDailyReminder, registerForPushNotificationsAsync } from './Notifications';
import { useNavigation } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);

  // when user logs in, prompt permission & schedule notifications
  useEffect(() => {
    if (user) {
      registerForPushNotificationsAsync();
      scheduleDailyReminder();
    }
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (currentUser) => {
      console.log('user', currentUser);
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Stack.Navigator initialRouteName="Login">
      {user ? (
        // Render one screen that contains the tabs.
        <Stack.Screen 
          name="TabsLayout" 
          component={TabsLayout} 
          options={{ headerShown: false }} 
        />
      ) : (
        <>
          <Stack.Screen name="Login" component={HomePage} options={{ headerShown: false }} />
          <Stack.Screen name="CreateAccount" component={CreateAccount} options={{ headerShown: false }} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
        </>
      )}
    </Stack.Navigator>
  );
}
