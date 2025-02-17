import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ImageBackground, ScrollView, Modal, Button } from "react-native";
import { useRouter } from 'expo-router';

const API_KEY = "9b1d4ae4a4e940beb3c9d6dec4f8e5ea"; // Replace with your Spoonacular API key

const pantryItems = [
];

const returnItems = [
];

const fetchFoodImage = async (foodName) => {
    try {
        const response = await fetch(
            `https://api.spoonacular.com/food/ingredients/search?query=${foodName}&apiKey=${API_KEY}`
        );
        const data = await response.json();
       
        if (data?.results?.length > 0) {
            const image = `https://spoonacular.com/cdn/ingredients_100x100/${data.results[0].image}`;
            return image;
        } else {
            return require("../../assets/images/default.png"); // Default image
        }
    } catch (error) {
        console.error("Error fetching image:", error);
        return require("../../assets/images/default.png"); // Default image on error
    }
};


const Pantry = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [newItem, setNewItem] = useState('');
    const [newQuantity, setNewQuantity] = useState('');
    const [items, setItems] = useState(pantryItems);
    const router = useRouter();

    const handleAddItem = async () => {
        if (newItem && newQuantity) {
            const newId = items.length + 1;
            const itemKey = newItem.toLowerCase().trim();
            returnItems.push({ id: newId, title: itemKey, quantity: newQuantity });
            // Fetch image dynamically
            const image = await fetchFoodImage(itemKey);
            if(typeof(image) == "number") {
                const newItemObj = { id: newId, title: newItem, image: image };
                setItems([...items, newItemObj]);
            } else {
                const newItemObj = { id: newId, title: newItem, image: { uri: image } };
                setItems([...items, newItemObj]);
            }
            setNewItem('');
            setNewQuantity('');
            setModalVisible(false);
        }
    };

    return (
        <>
            <ImageBackground
                source={require('../../assets/images/Pantry_bg.png')}
                style={styles.backgroundImage}
            />
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/pages/Dashboard')}>
        <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>
                        KITCHEN<Text style={styles.syncText}>Sync</Text>
                    </Text>
                </View>


                {/* Add Item Button */}
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            </View>


            {/* Modal for adding item */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalLabel}>Item Name:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Item Name"
                            value={newItem}
                            onChangeText={setNewItem}
                        />
                    <Text style={styles.modalLabel}>Quantity:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Quantity"
                            value={newQuantity}
                            onChangeText={setNewQuantity}
                            keyboardType="numeric"
                        />
                        <TouchableOpacity onPress={handleAddItem} style={styles.submitButton}>
                            <Text style={styles.submitButtonText}>Add Item</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>


            <ScrollView>
                <View style={styles.gridContainer}>
                    {items.map((item, index) => (
                        <View key={item.id} style={styles.itemContainer}>
                            <Image source={item.image} style={styles.itemImage} />
                            <Text style={styles.itemTitle}>{item.title}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </>
    );
};


const styles = StyleSheet.create({
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

    container: {
        marginTop: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    logoContainer: {
        marginBottom: 60,
        alignItems: "center",
    },
    logoText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#8B0000",
        marginTop: 20,
        left: 110
    },
    syncText: {
        color: "#000",
    },
    addButton: {
        position: 'absolute',
        top: 20,
        right: 25,
        backgroundColor: '#8B0000',
        borderRadius: 50,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
    },
    gridContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-evenly",
        paddingHorizontal: 10,
    },
    itemContainer: {
        width: "50%",
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 8,
        borderRadius: 5,
    },
    submitButton: {
        backgroundColor: '#8B0000',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 10,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
    },
    cancelButton: {
        backgroundColor: '#ccc',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    cancelButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export {returnItems};
export default Pantry;