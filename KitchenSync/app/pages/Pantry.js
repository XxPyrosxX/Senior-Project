import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ImageBackground, ScrollView, Modal } from "react-native";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AntDesign } from "@expo/vector-icons";
import { scheduleExpirationNotifications } from '../Notifications';

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
  const [expirationDate, setExpirationDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  // Helper function to determine expiration text style:
  const getExpirationTextStyle = (expirationISO) => {
    if (!expirationISO) return {};
    const expDate = new Date(expirationISO);
    const today = new Date();
    const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
    if (diffDays <= 2) return { color: 'red' };
    if (diffDays <= 4) return { color: '#DAA520' }; // updated darker yellow
    return {};
  };

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

  const handleSubmit = async () => {
    if (newItem && newQuantity && !editItem) {
      // Adding new item—set expirationDate only if provided
      const newId = items.length + 1;
      const image = await fetchFoodImage(newItem.toLowerCase().trim());
      const dateAdded = new Date().toISOString();
      let newItemObj;
      if (typeof image === "number") {
        newItemObj = {
          id: newId,
          title: newItem,
          quantity: newQuantity,
          image: image,
          dateAdded,
          expirationDate: expirationDate ? expirationDate.toISOString() : null
        };
      } else {
        newItemObj = {
          id: newId,
          title: newItem,
          quantity: newQuantity,
          image: { uri: image },
          dateAdded,
          expirationDate: expirationDate ? expirationDate.toISOString() : null
        };
      }
      setItems([...items, newItemObj]);
      
      // Schedule expiration notifications if there's an expiration date
      if (expirationDate) {
        await scheduleExpirationNotifications(newItemObj);
      }
    } else if (editItem) {
      // Editing existing item: update only expirationDate.
      const updatedItem = { 
        ...editItem, 
        expirationDate: expirationDate ? expirationDate.toISOString() : null 
      };
      
      const updatedItems = items.map(item =>
        item.id === editItem.id ? updatedItem : item
      );
      
      setItems(updatedItems);
      await AsyncStorage.setItem('pantryItems', JSON.stringify(updatedItems));
      
      // Schedule or update expiration notifications
      if (expirationDate) {
        await scheduleExpirationNotifications(updatedItem);
      }
    }
    // Reset fields and close modal
    setNewItem('');
    setNewQuantity('');
    setExpirationDate(null);
    setEditItem(null);
    setModalVisible(false);
  };

  const handleEditItem = (item) => {
    // Only edit expiration date – if not set, use new Date() instead of defaulting to December 31, 1969.
    setEditItem(item);
    setExpirationDate(item.expirationDate ? new Date(item.expirationDate) : new Date());
    setModalVisible(true);
  };

  const handleDeleteItem = async (id) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    try {
      await AsyncStorage.setItem('pantryItems', JSON.stringify(updatedItems));
      // Import and call a function to cancel notifications for the deleted item
      const { cancelExistingItemNotifications } = require('../Notifications');
      await cancelExistingItemNotifications(id);
    } catch (error) {
      console.error('Error deleting pantry item:', error);
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
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color="#8B0000" />
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
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Add Item Button (positioned separately) */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          // Reset new item fields for adding mode
          setNewItem('');
          setNewQuantity('');
          setExpirationDate(null);
          setEditItem(null);
          setModalVisible(true);
        }}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <ScrollView>
        <View style={styles.gridContainer}>
          {filteredItems.map((item) => (
            <View key={item.id} style={styles.itemContainer}>
              <TouchableOpacity
                style={{ alignItems: 'center' }}
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
                    expirationDate: item.expirationDate,
                  });
                }}
              >
                <Image source={item.image} style={styles.itemImage} />
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={[styles.dateAdded, getExpirationTextStyle(item.expirationDate)]}>
                  {item.expirationDate ? `Expires on: ${new Date(item.expirationDate).toLocaleDateString()}` : "Expiration Date: N/A"}
                </Text>
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', marginTop: 5 }}>
                <TouchableOpacity
                  style={[styles.editButton, { marginRight: 5 }]}
                  onPress={() => handleEditItem(item)}
                >
                  <Text style={styles.deleteButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteItem(item.id)}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Modal for adding/editing item */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => { setModalVisible(false); setEditItem(null); }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {editItem ? (
              // Edit mode: allow editing expiration date only.
              <>
                <Text style={styles.modalLabel}>Edit Expiration Date for {editItem.title}:</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
                  <Text>
                    {expirationDate ? new Date(expirationDate).toLocaleDateString() : 'Select Date'}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={expirationDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) {
                        setExpirationDate(selectedDate);
                      }
                    }}
                  />
                )}
                <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                  <Text style={styles.submitButtonText}>Update Expiration Date</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setModalVisible(false); setEditItem(null); }} style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            ) : (
              // New item mode: full form.
              <>
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
                {/* Updated label with (optional) */}
                <Text style={styles.modalLabel}>Expiration Date (optional):</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
                  <Text>
                    {expirationDate ? new Date(expirationDate).toLocaleDateString() : 'Select Date'}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={expirationDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) {
                        setExpirationDate(selectedDate);
                      }
                    }}
                  />
                )}
                <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                  <Text style={styles.submitButtonText}>{editItem ? 'Update Item' : 'Add Item'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setModalVisible(false); setEditItem(null); }} style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
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
    top: 60,
    left: 10,
    padding: 10,
    //backgroundColor: 'rgba(255,255,255,0.7)',
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
    fontSize: 28,
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
    right: 20,
    backgroundColor: '#8B0000',
    borderRadius: 50,
    width: 40,
    height: 40,
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
    textAlign: 'center',
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
  deleteButton: {
    backgroundColor: '#FF6347',
    borderRadius: 5,
    padding: 5,
    marginTop: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  datePickerButton: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    justifyContent: 'center',
    paddingLeft: 8,
    borderRadius: 5,
  },
  editButton: {
    backgroundColor: '#4682B4',
    borderRadius: 5,
    padding: 5,
    marginTop: 5,
  },
});

export default Pantry;