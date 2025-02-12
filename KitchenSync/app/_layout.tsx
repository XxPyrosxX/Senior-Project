import { Tabs } from "expo-router";
import { Image } from "react-native";

export default function RootLayout() {
  return (
    <Tabs
    initialRouteName="pages/HomePage" // Set the initial route to HomePage
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#228B22", // Green background color
          borderTopWidth: 0,          // Remove top border
          height: 80,                 // Adjust height for better spacing
        },
        tabBarActiveTintColor: "#FFF",   // Active icon color (white)
        tabBarInactiveTintColor: "#FFF", // Inactive icon color (white)
        tabBarLabelStyle: {
          display: "none", // Hide labels
        },
      }}
    >

      {/* Dashboard Screen */}
      <Tabs.Screen
        name="pages/Dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Image
              source={{
                uri: "https://img.icons8.com/ios-filled/50/FFFFFF/home.png",
              }}
              style={{ width: 30, height: 30, marginBottom: -20 }}
            />
          ),
        }}
      />

      {/* Camera Screen */}
      <Tabs.Screen
        name="pages/Camera"
        options={{
          title: "Camera",
          tabBarIcon: ({ color, size }) => (
            <Image
              source={{
                uri: "https://img.icons8.com/ios-filled/50/FFFFFF/camera.png",
              }}
              style={{ width: 30, height: 30, marginBottom: -20 }}
            />
          ),
        }}
      />

      {/* Settings Screen */}
      <Tabs.Screen
        name="pages/SettingsPage"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Image
              source={{
                uri: "https://img.icons8.com/ios-filled/50/FFFFFF/settings.png",
              }}
              style={{ width: 30, height: 30, marginBottom: -20 }}
            />
          ),
        }}
      />

      {/* Hidden Pages */}
      <Tabs.Screen
        name="pages/ShoppingList"
        options={{
          href: null, // This ensures the page is not accessible via the tab bar
        }}
      />
      <Tabs.Screen
        name="pages/Pantry"
        options={{
          href: null, 
        }}
      />
      <Tabs.Screen
        name="pages/CreateAccount"
        options={{
          tabBarStyle: { display: "none" },
          href: null, 
        }}
      />
      <Tabs.Screen
        name="pages/HomePage"
        options={{
          tabBarStyle: { display: "none" },
          title: "Home",
          // You can also hide the tab altogether by setting href: null if needed
          //href: null,
        }}
      />

      {/* Optional: Null Index */}
      <Tabs.Screen name="index" options={{ href: null }} />
    </Tabs>
  );
}
