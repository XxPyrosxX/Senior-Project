import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function Dashboard() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.rowsContainer}>
        {/* Top Row */}
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/pages/Pantry')}
          > 
            <Image
              source={require('../../assets/images/kitchen_stock_icon.png')}
              style={{ width: 150, height: 150 }}
            />
            <Text style={styles.buttonText}>Kitchen{"\n"}Stock</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/pages/PantryRecipes')}
          >
            <Image
              source={require('../../assets/images/ready_to_cook.png')}
              style={{ width: 150, height: 150 }}
            />
            <Text style={styles.buttonText}>Meal{"\n"}Ideas</Text>
          </TouchableOpacity>
        </View>

        {/* Logo in the middle with box */}
        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            <Text style={styles.logo}>
              KITCHEN<Text style={styles.syncText}>Sync</Text>
            </Text>
          </View>
        </View>

        {/* Bottom Row */}
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/pages/ShoppingList')}
          >
            <Image
              source={require('../../assets/images/grocery.png')}
              style={{ width: 175, height: 150 }}
              />
            <Text style={styles.buttonText}>Grocery{"\n"}List</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              Alert.alert('Coming Soon', 'This feature is under development.')
            }
          >
            <Image
              source={require('../../assets/images/cravings.png')}
              style={{ width: 125, height: 150 }}
              />
            <Text style={styles.buttonText}>Cravings{"\n"}Menu</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFACD', 
    padding: 10,
  },
  rowsContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 5,
    marginVertical: 55, 
  },
  button: {
    width: '48%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#006400',
    borderWidth: 2,
    backgroundColor: '#FFD580', 
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    fontSize: 22,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#000000', 
    marginTop: 10,
    textAlign: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoBox: {
    width: '90%',
    padding: 20,
    borderColor: '#006400',
    borderWidth: 2,
    backgroundColor: '#FFD580',
    borderRadius: 15,
    marginVertical: -25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,

  },
  logo: {
    fontSize: 44,
    fontWeight: 'bold',
    color: '#8B0000', 
    textAlign: 'center',
  },
  syncText: {
    fontSize: 32,
    fontWeight: 'normal',
    fontStyle: 'italic',
    color: '#000000', 
  },
});