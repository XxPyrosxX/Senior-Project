import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const API_KEY = '9edb43dda3d64e96bae0e88cc7dde1c0';
const DETAILS_URL = 'https://api.spoonacular.com/recipes';

const PRecipeDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;
  
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await fetch(`${DETAILS_URL}/${id}/information?apiKey=${API_KEY}`);
        const data = await response.json();
        setRecipe(data);
      } catch (error) {
        console.error('Error fetching recipe details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecipeDetails();
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" color="#8B0000" style={styles.loadingIndicator} />;
  }

  if (!recipe) {
    return <Text style={styles.errorText}>Recipe not found.</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.navigate('PantryRecipes')}
      >
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
      <Text style={styles.recipeTitle}>{recipe.title}</Text>

      <Text style={styles.sectionTitle}>Ingredients:</Text>
      {recipe.extendedIngredients.map((ingredient, index) => (
        <Text key={index} style={styles.ingredientText}>• {ingredient.original}</Text>
      ))}

      <Text style={styles.sectionTitle}>Instructions:</Text>
      <Text style={styles.instructions}>{recipe.instructions ? recipe.instructions.replace(/<\/?[^>]+(>|$)/g, "") : "No instructions available."}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
    paddingTop: 40,
  },
  backButton: {
    padding: 5,
    backgroundColor: '#8B0000',
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
  recipeImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  recipeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    color: '#8B0000',
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  ingredientText: {
    fontSize: 16,
    color: '#555',
  },
  instructions: {
    fontSize: 16,
    color: '#333',
    marginTop: 5,
  },
  loadingIndicator: {
    marginTop: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default PRecipeDetails;
