import { Stack, Tabs } from "expo-router";

export default function RootLayout() {
  //return <Stack screenOptions={{ headerShown: false }} />;
 return(
 <Tabs>
     <Stack.Screen name="pages/HomePage" options={{ title: 'Login' }} />
     <Tabs.Screen name="pages/Pantry" options={{ title: "Pantry" }} />

      //hide a page 
     <Tabs.Screen name="index" options={{ href: null }} />
    
  </Tabs>
  );
 
}
