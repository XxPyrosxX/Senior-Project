//import { Tabs } from "expo-router";
import { Image } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from './pages/HomePage';
import Dashboar from './insideLayout';
import { useEffect, useState } from 'react';
import { User, onAuthStateChanged  } from 'firebase/auth';
import { FIREBASE_APP, FIREBASE_AUTH } from "@/FirebaseConfig";




const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();




function InsideLayout() {
  return(
    <InsideStack.Navigator>
      <InsideStack.Screen
        name = "Dashboard"
        component = {Dashboar}
        options={{ headerShown: false }}
        />




    </InsideStack.Navigator>
  )
}








export default function RootLayout() {
  const [user, setUser] = useState <User | null> (null);
  useEffect (() => {
    onAuthStateChanged(FIREBASE_AUTH, (user)=>{
      console.log('user',user);
      setUser(user);
    });
  }, []);
  return (




    <Stack.Navigator initialRouteName="Login">
      {user ? (
        <Stack.Screen name="UserPage" component={InsideLayout} options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      )}
     
    </Stack.Navigator>
  );
}

