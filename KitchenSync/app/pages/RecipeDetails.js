import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import RenderHTML from 'react-native-render-html'; // Added library
import { useWindowDimensions } from 'react-native';

const API_KEY = '9edb43dda3d64e96bae0e88cc7dde1c0';
const BASE_URL = 'https://api.spoonacular.com/recipes';

// craving menu recepies 
const RecipeDetails = () => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params; // Get recipe ID from navigation
  const { width } = useWindowDimensions(); // Required for RenderHTML

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}/${id}/information?apiKey=${API_KEY}`);
        const data = await response.json();

        if (data) {
          setRecipe(data);
        } else {
          Alert.alert('Error', 'Recipe not found.');
        }
      } catch (error) {
        console.error('Error fetching recipe details:', error);
        Alert.alert('Error', 'Failed to load recipe details.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" color="#8B0000" style={{ marginTop: 50 }} />;
  }

  if (!recipe) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Recipe not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.navigate('Recipes')}
      >
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>


      {/* Recipe Details */}
      <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
      <Text style={styles.title}>{recipe.title}</Text>

      <Text style={styles.sectionTitle}>Ingredients</Text>
      {recipe.extendedIngredients.map((ingredient, index) => (
        <Text key={index} style={styles.ingredientText}>
          • {ingredient.original}
        </Text>
      ))}

      <Text style={styles.sectionTitle}>Instructions</Text>
      {/* RenderHTML for proper HTML formatting */}
      <RenderHTML
        contentWidth={width}
        source={{ html: recipe.instructions || '<p>No instructions available.</p>' }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 30,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 5,
    zIndex: 10,
  },
  backText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  recipeImage: {
    width: '100%',
    height: 200,
    marginTop: 60,
    borderRadius: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B0000',
    textAlign: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 5,
  },
  ingredientText: {
    fontSize: 16,
    color: '#555',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});

export default RecipeDetails;

