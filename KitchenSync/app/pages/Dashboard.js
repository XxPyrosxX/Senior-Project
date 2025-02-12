import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function Dashboard() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>
        KITCHEN<Text style={styles.syncText}>Sync</Text>
      </Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/pages/Pantry')}
        >
          <Text style={styles.buttonText}>MY PANTRY</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            Alert.alert('Coming Soon', 'This feature is under development.')
          }
        >
          <Text style={styles.buttonText}>PANTRY RECIPES</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/pages/ShoppingList')}
        >
          <Text style={styles.buttonText}>SHOPPING LIST</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            Alert.alert('Coming Soon', 'This feature is under development.')
          }
        >
          <Text style={styles.buttonText}>WANT TO MAKE</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    fontWeight: 'normal',
    fontStyle: 'italic',
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
});