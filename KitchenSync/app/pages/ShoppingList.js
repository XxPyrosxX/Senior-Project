import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, ImageBackground, FlatList, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";

const ShoppingList = () => {
    const [item, setItem] = useState('');
    const [list, setList] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const loadList = async () => {
            try {
                const storedList = await AsyncStorage.getItem('shoppingList');
                if (storedList) {
                    setList(JSON.parse(storedList));
                }
            } catch (error) {
                console.error("Failed to load shopping list:", error);
            }
        };
        loadList();
    }, []);

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

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.name}</Text>
            <TouchableOpacity onPress={() => deleteItem(item.id)} style={styles.deleteButton}>
                <AntDesign name="closecircle" size={20} color="red" />
            </TouchableOpacity>
        </View>
    );

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

                {/* Shopping List */}
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
        backgroundColor: '#D8E4BC', // Off-white for list items
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
});

export default ShoppingList;
