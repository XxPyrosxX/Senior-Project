import { Tabs } from "expo-router";
import { Image } from "react-native";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // Customize the overall tab bar style
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
      {/* Home Screen */}
      <Tabs.Screen
        name="pages/Dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Image
              source={{
                uri: "https://img.icons8.com/ios-filled/50/FFFFFF/home.png", // Home icon URI
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
                uri: "https://img.icons8.com/ios-filled/50/FFFFFF/camera.png", // Camera icon URI
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
                uri: "https://img.icons8.com/ios-filled/50/FFFFFF/settings.png", // Settings icon URI
              }}
              style={{ width: 30, height: 30, marginBottom: -20 }}
            />
          ),
        }}
      />

      <Tabs.Screen name="index" options={{ href: null }} />
    </Tabs>
  );

}
