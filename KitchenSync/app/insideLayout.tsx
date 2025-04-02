import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from './pages/Dashboard';
import Camera from './pages/Camera';
import SettingsPage from './pages/SettingsPage';
import Pantry from './pages/Pantry';
import PantryRecipes from './pages/PantryRecipes';
import PRecipeDetails from './pages/PantryRecipeDetails';
import Recipes from './pages/Recipes';
import RecipeDetails from './pages/RecipeDetails';
import ShoppingList from './pages/ShoppingList';
import ItemInfo from './pages/ItemInfo';
import About from './pages/settings/About';
import createAccount from './pages/CreateAccount';
import Login from './pages/HomePage';
import { LogBox } from 'react-native';
import AccountSettings from './pages/settings/AccountInformation';

// Ignore specific warning messages
LogBox.ignoreLogs([
  'bound renderChildren: Support for defaultProps will be removed from function components',
  'TRenderEngineProvider: Support for defaultProps will be removed from function components',
  'MemoizedTNodeRenderer: Support for defaultProps will be removed from memo components',
  'TNodeChildrenRenderer: Support for defaultProps will be removed from function components'
]);

const Tab = createBottomTabNavigator();

export default function TabsLayout() {
  return (
    <Tab.Navigator
      initialRouteName='Dashboard' // Default screen
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
        name="PRecipeDetails"
        component={PRecipeDetails}
        options={{ tabBarItemStyle: { display: "none" } }}
      />
      <Tab.Screen
        name="Recipes"
        component={Recipes}
        options={{ tabBarItemStyle: { display: "none" } }}
      />
      <Tab.Screen
        name="RecipeDetails"
        component={RecipeDetails}
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
      <Tab.Screen
        name="AccountSettings"
        component={AccountSettings}
        options={{tabBarItemStyle: {display: "none"}}}
      />
    </Tab.Navigator>
  );
}


