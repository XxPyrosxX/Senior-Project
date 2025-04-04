import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from './pages/HomePage';
import CreateAccount from './pages/CreateAccount';
import TabsLayout from './insideLayout';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from '@/FirebaseConfig';
import { scheduleDailyReminder } from './Notifications';

const Stack = createNativeStackNavigator();

export default function RootLayout() {
  useEffect(() => {
    scheduleDailyReminder();
  }, []);
  const [user, setUser] = useState<User | null>(null);

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
        </>
      )}
    </Stack.Navigator>
  );
}
