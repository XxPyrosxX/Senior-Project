import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from './pages/Dashboard';
import Camera from './pages/Camera';
import SettingsPage from './pages/SettingsPage';
import Pantry from './pages/Pantry';
import PantryRecipes from './pages/PantryRecipes';
import ShoppingList from './pages/ShoppingList';
import ItemInfo from './pages/ItemInfo';
import About from './pages/settings/About';
import createAccount from './pages/CreateAccount';
import Login from './pages/HomePage';

const Tab = createBottomTabNavigator();

export default function TabsLayout() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#b23e3e",
          borderTopWidth: 0,
          height: 80,
        },
        tabBarActiveTintColor: "#FFF",
        tabBarInactiveTintColor: "#FFF",
        tabBarLabelStyle: { display: "none" },
        tabBarItemStyle: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
      }}
    >
      {/* Visible screens – these take equal space */}
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          tabBarIcon: () => (
            <Image
              source={{ uri: "https://img.icons8.com/ios-filled/50/FFFFFF/home.png" }}
              style={{ width: 30, height: 30, marginBottom: -20 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Camera"
        component={Camera}
        options={{
          tabBarStyle: { display: "none" },
          tabBarIcon: () => (
            <Image
              source={{ uri: "https://img.icons8.com/ios-filled/50/FFFFFF/camera.png" }}
              style={{ width: 30, height: 30, marginBottom: -20 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="SettingsPage"
        component={SettingsPage}
        options={{
          tabBarIcon: () => (
            <Image
              source={{ uri: "https://img.icons8.com/ios-filled/50/FFFFFF/settings.png" }}
              style={{ width: 30, height: 30, marginBottom: -20 }}
            />
          ),
        }}
      />

      {/* Hidden screens – these will not reserve space in the tab bar */}
      <Tab.Screen
        name="Pantry"
        component={Pantry}
        options={{ tabBarItemStyle: { display: "none" } }}
      />
      <Tab.Screen
        name="PantryRecipes"
        component={PantryRecipes}
        options={{ tabBarItemStyle: { display: "none" } }}
      />
      <Tab.Screen
        name="ShoppingList"
        component={ShoppingList}
        options={{ tabBarItemStyle: { display: "none" } }}
      />
      <Tab.Screen
        name="ItemInfo"
        component={ItemInfo}
        options={{ tabBarItemStyle: { display: "none" } }}
      />
      <Tab.Screen
        name="About"
        component={About}
        options={{ tabBarItemStyle: { display: "none" } }}
      />
      <Tab.Screen
        name="CreateAccount"
        component={createAccount}
        options={{ tabBarItemStyle: { display: "none" } }}
      />
      <Tab.Screen
        name="HomePage"
        component={Login}
        options={{ tabBarItemStyle: { display: "none" } }}
        />
    </Tab.Navigator>
  );
}


