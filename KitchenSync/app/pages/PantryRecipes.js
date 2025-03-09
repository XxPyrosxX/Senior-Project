import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ImageBackground, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { returnItems } from './Pantry';

const API_KEY = '9edb43dda3d64e96bae0e88cc7dde1c0';
const BASE_URL = 'https://api.spoonacular.com/recipes/findByIngredients';

const PantryRecipes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        if (returnItems.length === 0) {
          setLoading(false);
          return;
        }
        const ingredients = returnItems.map(item => item.title).join(',');
        const response = await fetch(`${BASE_URL}?ingredients=${ingredients}&number=20&apiKey=${API_KEY}`);
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ImageBackground source={require('../../assets/images/Pantry_bg.png')} style={styles.backgroundImage}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>KITCHEN<Text style={styles.syncText}>Sync</Text></Text>
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder="Search recipes..."
        placeholderTextColor="#666"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <Text style={styles.recipeCount}>
        {filteredRecipes.length} {filteredRecipes.length === 1 ? 'Recipe' : 'Recipes'} Found
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#8B0000" style={styles.loadingIndicator} />
      ) : (
        <FlatList
          data={filteredRecipes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.recipeCard}>
              <Image source={{ uri: item.image }} style={styles.recipeImage} />
              <Text style={styles.recipeTitle}>{item.title}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyMessage}>No recipes found.</Text>}
        />
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 10,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 5,
    zIndex: 10,
  },
  backText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  logoContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B0000',
  },
  syncText: {
    color: '#000',
  },
  searchBar: {
    width: '90%',
    height: 45,
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginTop: 20,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  recipeCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#444',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  loadingIndicator: {
    marginTop: 20,
  },
  recipeCard: {
    backgroundColor: '#fff',
    marginVertical: 10,
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 4,
  },
  recipeImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  recipeTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  emptyMessage: {
    marginTop: 20,
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
  },
});

export default PantryRecipes;