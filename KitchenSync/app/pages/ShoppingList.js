import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, ImageBackground, FlatList, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ShoppingList = () => {
    const [item, setItem] = useState('');
    const [list, setList] = useState([]);

    // Load saved list from AsyncStorage when component mounts
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

    // AsyncStorage
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
            <Button title="Delete" onPress={() => deleteItem(item.id)} />
        </View>
    );

    return (
        <>
            <ImageBackground source={require('../../assets/images/Pantry_bg.png')} style={styles.backgroundImage} />
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>
                        KITCHEN<Text style={styles.syncText}>Sync</Text>
                    </Text>
                </View>
                <Text style={styles.title}>Shopping List</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter item"
                         placeholderTextColor= 'black'
                        value={item}
                        onChangeText={setItem}
                    />
                    <Button title="Add" onPress={addItem} />
                </View>
                <FlatList
                    data={list}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    style={styles.list}
                />
            </View>
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
    container: {
        flex: 1,
        padding: 20,
        marginTop: 40
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    inputContainer: {
        flexDirection: "row",
        marginBottom: 20,
        backgroundColor: 'cbcbcb',
        
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginRight: 10,
        color: 'Red',
    },
    itemContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    itemText: {
        fontSize: 16,
    },
    list: {
        flex: 1,
    }
});

export default ShoppingList;
