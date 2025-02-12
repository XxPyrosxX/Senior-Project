import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ImageBackground, ScrollView } from "react-native";
import { useRouter } from 'expo-router';

const pantryItems = [
    { id: 1, title: "Apples", image: require("../../assets/images/apple.png") },
    { id: 2, title: "Bananas", image: require("../../assets/images/banana.png") },
    { id: 3, title: "Peanut Butter", image: require("../../assets/images/peanutbutter.png") },
    { id: 4, title: "Milk", image: require("../../assets/images/milk_carton.png") },
];

const Pantry = () => {
    const router = useRouter();
    return (
        <>
        <ImageBackground
                source={require('../../assets/images/Pantry_bg.png')}
                style={styles.backgroundImage}
            />
            {/* Back Button at the top left */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/pages/Dashboard')}>
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
        <View>
          <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Text style={styles.logoText}>
                    KITCHEN<Text style={styles.syncText}>Sync</Text>
                </Text>
            </View>
        </View>
        </View>
        <ScrollView>
            <View style={styles.gridContainer}>
            {pantryItems.map((item, index) => (
                <View key={item.id} style={styles.itemContainer}>
                <Image source={item.image} style={styles.itemImage} />
                <Text style={styles.itemTitle}>{item.title}</Text>
                </View>
            ))}
            </View>
        </ScrollView>
        </> 
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        paddingBottom: 20,
        paddingTop: 50,
    },

    backgroundImage: {
    flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
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
        fontWeight: "bold",
      },

    logoContainer: {
    marginBottom: 20,
    alignItems: "center",
    },

    logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#8B0000",
    marginTop: 55,
    },

    syncText: {
    color: "#000",
    },

    gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    paddingHorizontal: 10,
    },

    itemContainer: {
    width: "45%", // Two items per row
    alignItems: "center",
    marginBottom: 20,
    },

    itemImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    },

    itemTitle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "bold",
    },
});

export default Pantry;