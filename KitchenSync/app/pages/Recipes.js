import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ImageBackground, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from "@expo/vector-icons"; 

const API_KEY = '9edb43dda3d64e96bae0e88cc7dde1c0';
const BASE_URL = 'https://api.spoonacular.com/recipes/complexSearch';

const Recipes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // Fetch recipes (random by default, filtered if searchQuery exists)
  // Cravings recepie 
  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
  
      try {
        const queryParam = searchQuery 
          ? `&query=${encodeURIComponent(searchQuery)}` 
          : '';
  
        const response = await fetch(`${BASE_URL}?number=20${queryParam}&apiKey=${API_KEY}`);
        const data = await response.json();
  
        setRecipes(data.results || []);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchRecipes();
  }, [searchQuery]);
  
  return (
    <ImageBackground
      source={require('../../assets/images/kitchen_sync_bg.png')}
      style={styles.backgroundImage}
    >
       <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <AntDesign name="arrowleft" size={24} color="#8B0000" />
        </TouchableOpacity>

      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>
          KITCHEN<Text style={styles.syncText}>Sync</Text>
        </Text>
      </View>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search recipes..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <Text style={styles.recipeCount}>
        {recipes.length} {recipes.length === 1 ? 'Recipe' : 'Recipes'} Found
      </Text>

      {/* Loading or Recipes List */}
      {loading ? (
        <ActivityIndicator size="large" color="#8B0000" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.recipeContainer}
              onPress={() => navigation.navigate('RecipeDetails', { id: item.id })}
            >
              <Image source={{ uri: item.image }} style={styles.recipeImage} />
              <Text style={styles.recipeTitle}>{item.title}</Text>
            </TouchableOpacity>
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
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 10,
    padding: 10,
    //backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 5,
    zIndex: 10,
  },
  backText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B0000',
    marginTop: 20,
  },
  syncText: {
    color: '#000',
  },
  searchBar: {
    width: '90%',
    height: 40,
    backgroundColor: '#D3D3D3',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 20,
  },
  recipeCount: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  recipeContainer: {
    alignItems: 'center',
    marginTop: 15,
  },
  recipeImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  recipeTitle: {
    marginTop: 8,
    fontSize: 16,
    marginLeft: 20,
    marginRight: 20,
    textAlign: 'center',
  },
  emptyMessage: {
    marginTop: 20,
    fontSize: 18,
    color: 'gray',
  },
});

export default Recipes;
