import React, { useState, useEffect  } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ImageBackground, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import {returnItems} from "./Pantry";

const API_KEY = '9edb43dda3d64e96bae0e88cc7dde1c0';
const BASE_URL = 'https://api.spoonacular.com/recipes/findByIngredients';

const PantryRecipes = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

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

    // Store pantryItems from Pantry.js into here
    console.log(recipes);
    const filteredRecipes = recipes.filter(recipe =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <ImageBackground
            source={require('../../assets/images/Pantry_bg.png')}
            style={styles.backgroundImage}
        >
            <TouchableOpacity style={styles.backButton} onPress={() => router.push('/pages/Dashboard')}>
                <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            <View style={styles.logoContainer}>
                <Text style={styles.logoText}>
                    KITCHEN<Text style={styles.syncText}>Sync</Text>
                </Text>
            </View>

            <TextInput
                style={styles.searchBar}
                placeholder="Search recipes..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

        <Text style={styles.recipeCount}>
                {filteredRecipes.length} {filteredRecipes.length === 1 ? 'Recipe' : 'Recipes'} Found
            </Text>

            {loading ? (
                <ActivityIndicator size="large" color="#8B0000" style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={filteredRecipes}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.recipeContainer}>
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
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 10,
        padding: 10,
        backgroundColor: 'rgba(255,255,255,0.7)',
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
        marginLeft: 20,  // Add 20 margin to the left
        marginRight: 20, // Add 20 margin to the right
        textAlign: 'center', // Center the text
    },
    emptyMessage: {
        marginTop: 20,
        fontSize: 18,
        color: 'gray',
    },
});

export default PantryRecipes;