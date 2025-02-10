import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
// Import the Pantry component from pantry.js
import Pantry from './Pantry';

type RootStackParamList = {
  Home: undefined;
  Pantry: undefined;
};

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>KITCHEN
        <Text style={styles.syncText}>Sync
        </Text>
        </Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Pantry')}
        >
          <Text style={styles.buttonText}>MY PANTRY</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => Alert.alert('Coming Soon', 'This feature is under development.')}>
          <Text style={styles.buttonText}>PANTRY RECIPES</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => Alert.alert('Coming Soon', 'This feature is under development.')}>
          <Text style={styles.buttonText}>SHOPPING LIST</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => Alert.alert('Coming Soon', 'This feature is under development.')}>
          <Text style={styles.buttonText}>WANT TO MAKE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Dashboard() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      {/* Use the imported Pantry component */}
      <Stack.Screen name="Pantry" component={Pantry} options={{ title: 'My Pantry' }} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF4CF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#9E2A2B',
    marginBottom: 20,
  },
  syncText: {
    fontSize: 28,
    fontWeight: "normal",
    fontStyle: "italic",
    color: '#000',
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  button: {
    width: 140,
    height: 80,
    margin: 10,
    backgroundColor: '#FEE9A3',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    borderWidth: 2,
    borderColor: '#000',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  pageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF4CF',
  },
  pageText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9E2A2B',
  },
});
