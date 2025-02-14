import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ImageBackground, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import pantryItems from './Pantry';  // Import Pantry.js

const PantryRecipes = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const filteredItems = pantryItems.length > 0
        ? pantryItems.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
        : [];

    return (
        <ImageBackground
            source={require('../../assets/images/Pantry_bg.png')}
            style={styles.backgroundImage}
        >
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => router.push('/pages/Dashboard')}>
                <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            {/* KitchenSync Logo */}
            <View style={styles.logoContainer}>
                <Text style={styles.logoText}>
                    KITCHEN<Text style={styles.syncText}>Sync</Text>
                </Text>
            </View>

            {/* Search Bar */}
            <TextInput
                style={styles.searchBar}
                placeholder="Search pantry items..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            {/* Display Pantry Items */}
            <FlatList
                data={filteredItems}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Image source={item.image} style={styles.itemImage} />
                        <Text style={styles.itemTitle}>{item.title}</Text>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyMessage}>No items in pantry. No recipes available.</Text>}
            />
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
    itemContainer: {
        alignItems: 'center',
        marginTop: 15,
    },
    itemImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    itemTitle: {
        marginTop: 8,
        fontSize: 16,
        fontWeight: 'bold',
    },
    emptyMessage: {
        marginTop: 20,
        fontSize: 18,
        color: 'gray',
    },
});

export default PantryRecipes;