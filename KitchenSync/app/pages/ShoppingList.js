import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, ImageBackground, FlatList, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";

const ShoppingList = () => {
    const [item, setItem] = useState('');
    const [list, setList] = useState([]);
    const [suggestedItems, setSuggestedItems] = useState([]);
    const [handledSuggestions, setHandledSuggestions] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const loadData = async () => {
            try {
                // Load shopping list
                const storedList = await AsyncStorage.getItem('shoppingList');
                if (storedList) {
                    setList(JSON.parse(storedList));
                }

                // Load previously handled suggestions
                const handledItems = await AsyncStorage.getItem('handledSuggestions');
                if (handledItems) {
                    setHandledSuggestions(JSON.parse(handledItems));
                }

                // Load pantry items to check for expiring items
                await loadSuggestedItems();
            } catch (error) {
                console.error("Failed to load data:", error);
            }
        };
        loadData();
    }, []);

    // Load and filter pantry items that are expiring soon
    const loadSuggestedItems = async () => {
        try {
            const storedItems = await AsyncStorage.getItem('pantryItems');
            if (storedItems) {
                const pantryItems = JSON.parse(storedItems);
                
                // Filter for items that are already expired, expiring today, or expiring within 4 days
                const expiringItems = pantryItems.filter(item => {
                    if (!item.expirationDate) return false;
                    
                    const expDate = new Date(item.expirationDate);
                    const today = new Date();
                    const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
                    
                    // Include expired items (negative days), today (0 days),
                    // or expiring soon (within 4 days), but not already handled
                    return diffDays <= 4 && !handledSuggestions.includes(item.id);
                });
                
                setSuggestedItems(expiringItems);
            }
        } catch (error) {
            console.error("Failed to load suggested items:", error);
        }
    };

    useEffect(() => {
        const saveList = async () => {
            try {
                await AsyncStorage.setItem('shoppingList', JSON.stringify(list));
            } catch (error) {
                console.error("Failed to save shopping list:", error);
            }
        };
        saveList();
    }, [list]);

    useEffect(() => {
        const saveHandledSuggestions = async () => {
            try {
                await AsyncStorage.setItem('handledSuggestions', JSON.stringify(handledSuggestions));
            } catch (error) {
                console.error("Failed to save handled suggestions:", error);
            }
        };
        saveHandledSuggestions();
    }, [handledSuggestions]);

    const addItem = () => {
        if (item.trim() !== '') {
            const newList = [...list, { id: Date.now().toString(), name: item }];
            setList(newList);
            setItem('');
        }
    };

    const deleteItem = (id) => {
        const updatedList = list.filter((item) => item.id !== id);
        setList(updatedList);
    };

    const handleSuggestion = (item, addToList) => {
        // Mark the suggestion as handled
        const updatedHandledSuggestions = [...handledSuggestions, item.id];
        setHandledSuggestions(updatedHandledSuggestions);
        
        // Add to shopping list if confirmed
        if (addToList) {
            const newList = [...list, { id: Date.now().toString(), name: item.title }];
            setList(newList);
        }
        
        // Remove from suggested items
        const updatedSuggestions = suggestedItems.filter(suggested => suggested.id !== item.id);
        setSuggestedItems(updatedSuggestions);
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.name}</Text>
            <TouchableOpacity onPress={() => deleteItem(item.id)} style={styles.deleteButton}>
                <AntDesign name="closecircle" size={20} color="red" />
            </TouchableOpacity>
        </View>
    );

    const renderSuggestedItem = ({ item }) => {
        const expDate = new Date(item.expirationDate);
        const today = new Date();
        const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
        
        // Determine color and message based on expiration timing
        let alertColor = '#DAA520'; // Default yellow for items expiring soon
        let expirationMessage = '';
        
        if (diffDays < 0) {
            // Already expired
            alertColor = '#8B0000'; // Deep red
            const abs = Math.abs(diffDays);
            expirationMessage = `Expired ${abs} ${abs === 1 ? 'day' : 'days'} ago`;
        } else if (diffDays === 0) {
            // Expiring today
            alertColor = '#FF0000'; // Bright red
            expirationMessage = 'Expires today';
        } else {
            // Expiring in the future
            expirationMessage = `Expires in ${diffDays} ${diffDays === 1 ? 'day' : 'days'}`;
        }
        
        return (
            <View style={[styles.suggestedItemContainer, {borderLeftColor: alertColor}]}>
                <View style={styles.suggestedItemInfo}>
                    <Text style={styles.suggestedItemText}>{item.title}</Text>
                    <Text style={[styles.expirationText, {color: alertColor}]}>
                        {expirationMessage}
                    </Text>
                </View>
                <View style={styles.suggestionButtons}>
                    <TouchableOpacity 
                        onPress={() => handleSuggestion(item, true)}
                        style={styles.confirmButton}
                    >
                        <Text style={styles.buttonText}>Add</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => handleSuggestion(item, false)}
                        style={styles.rejectButton}
                    >
                        <Text style={styles.buttonText}>Skip</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <ImageBackground source={require('../../assets/images/kitchen_sync_bg.png')} style={styles.backgroundImage}>
            <View style={styles.container}>
                {/* Back Button */}
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <AntDesign name="arrowleft" size={24} color="#8B0000" />
                </TouchableOpacity>

                {/* Logo */}
                <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>
                        KITCHEN<Text style={styles.syncText}>Sync</Text>
                    </Text>
                </View>

                <Text style={styles.title}>Grocery List</Text>

                {/* Input Field */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter item"
                        placeholderTextColor="#777"
                        value={item}
                        onChangeText={setItem}
                    />
                    <TouchableOpacity style={styles.addButton} onPress={addItem}>
                        <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                </View>

                {/* Suggested Items Section */}
                {suggestedItems.length > 0 && (
                    <View style={styles.suggestionsSection}>
                        <Text style={styles.suggestionTitle}>
                            Expiring Soon - Add to Shopping List?
                        </Text>
                        <FlatList
                            data={suggestedItems}
                            renderItem={renderSuggestedItem}
                            keyExtractor={(item) => `suggestion-${item.id}`}
                            style={styles.suggestionsList}
                        />
                    </View>
                )}

                {/* Shopping List */}
                <Text style={styles.listTitle}>My Shopping List</Text>
                <FlatList
                    data={list}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    style={styles.list}
                />
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    container: {
        flex: 1,
        padding: 20,
        marginTop: 40,
    },
    backButton: {
        position: 'absolute',
        top: 15,
        left: 20,
        zIndex: 10,
        padding: 10,
    },
    logoContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    logoText: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#8B0000",
        textAlign: "center",
    },
    syncText: {
        color: "#000",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    listTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 10,
        marginBottom: 10,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F5E1C8", 
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginBottom: 20,
    },
    input: {
        flex: 1,
        fontSize: 16,
        padding: 10,
    },
    addButton: {
        backgroundColor: "#8B0000",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    addButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
    itemContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: '#D8E4BC',
        padding: 12,
        marginBottom: 10,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    itemText: {
        fontSize: 18,
    },
    deleteButton: {
        padding: 5,
    },
    list: {
        flex: 1,
    },
    suggestionsSection: {
        marginBottom: 20,
    },
    suggestionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#8B0000",
    },
    suggestionsList: {
        maxHeight: 200,
    },
    suggestedItemContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 12,
        marginBottom: 10,
        borderRadius: 8,
        borderLeftWidth: 4,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    suggestedItemInfo: {
        flex: 1,
    },
    suggestedItemText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    expirationText: {
        fontSize: 12,
        marginTop: 2,
    },
    suggestionButtons: {
        flexDirection: "row",
    },
    confirmButton: {
        backgroundColor: "#4CAF50",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 4,
        marginRight: 8,
    },
    rejectButton: {
        backgroundColor: "#F44336",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 4,
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
    }
});

export default ShoppingList;
