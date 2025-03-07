import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ImageBackground, ScrollView, Modal } from "react-native";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY = "9edb43dda3d64e96bae0e88cc7dde1c0";

const pantryItems = [];
const returnItems = [];

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
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  // Load persisted pantry items when component mounts
  useEffect(() => {
    const loadItems = async () => {
      try {
        const storedItems = await AsyncStorage.getItem('pantryItems');
        if (storedItems) {
          setItems(JSON.parse(storedItems));
        }
      } catch (error) {
        console.error("Error loading pantry items:", error);
      }
    };
    loadItems();
  }, []);

  // Save items to AsyncStorage whenever they change
  useEffect(() => {
    const saveItems = async () => {
      try {
        await AsyncStorage.setItem('pantryItems', JSON.stringify(items));
      } catch (error) {
        console.error("Error saving pantry items:", error);
      }
    };
    saveItems();
  }, [items]);

  const handleAddItem = async () => {
    if (newItem && newQuantity) {
      const newId = items.length + 1;
      const itemKey = newItem.toLowerCase().trim();
      returnItems.push({ id: newId, title: itemKey, quantity: newQuantity });
      // Fetch image dynamically
      const image = await fetchFoodImage(itemKey);
      // Store the current date as an ISO string
      const dateAdded = new Date().toISOString();
      let newItemObj;
      if (typeof image === "number") {
          newItemObj = { id: newId, title: newItem, quantity: newQuantity, image: image, dateAdded };
      } else {
          newItemObj = { id: newId, title: newItem, quantity: newQuantity, image: { uri: image }, dateAdded };
      }
      setItems([...items, newItemObj]);
      setNewItem('');
      setNewQuantity('');
      setModalVisible(false);
    }
  };

  const filteredItems = searchQuery
      ? items.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
      : items;

  return (
    <>
      <ImageBackground
        source={require('../../assets/images/kitchen_sync_bg.png')}
        style={styles.backgroundImage}
      />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      
      <View style={styles.headerContainer}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>
            KITCHEN<Text style={styles.syncText}>Sync</Text>
          </Text>
        </View>
        {/* Search Bar placed below the logo */}
        <TextInput
          style={styles.searchBar}
          placeholder="Search Pantry Items..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Add Item Button (positioned separately) */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

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
          {filteredItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.itemContainer}
              onPress={() => {
                navigation.navigate('ItemInfo', {
                  id: item.id,
                  title: item.title,
                  quantity: item.quantity || 'N/A',
                  image:
                    typeof item.image === 'number'
                      ? Image.resolveAssetSource(item.image).uri
                      : item.image.uri,
                  dateAdded: item.dateAdded,
                });
              }}
            >
              <Image source={item.image} style={styles.itemImage} />
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.dateAdded}>
                Added on: {new Date(item.dateAdded).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
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
  headerContainer: {
    marginTop: 50,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#8B0000",
    marginTop: 20,
  },
  syncText: {
    color: "#000",
  },
  searchBar: {
    width: '90%',
    height: 40,
    backgroundColor: '#D3D3D3',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  addButton: {
    position: 'absolute',
    top: 65,
    right: 25,
    backgroundColor: '#8B0000',
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 11,
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
    marginTop: 20,
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
  dateAdded: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
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

export { returnItems };
export default Pantry;