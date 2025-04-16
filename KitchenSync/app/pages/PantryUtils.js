import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY = "9edb43dda3d64e96bae0e88cc7dde1c0";

// Replicate fetchFoodImage from the original Pantry component
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

// Function to add a new item to the pantry
const addItemToPantry = async (itemName, quantity, expirationDate = null) => {
  try {
    // Validate inputs
    if (!itemName || !quantity) {
      throw new Error('Item name and quantity are required');
    }

    // Load existing pantry items from AsyncStorage
    const storedItems = await AsyncStorage.getItem('pantryItems');
    const items = storedItems ? JSON.parse(storedItems) : [];

    // Generate a unique ID
    const newId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;

    // Fetch image for the item
    const image = await fetchFoodImage(itemName.toLowerCase().trim());

    // Create new item object
    const dateAdded = new Date().toISOString();
    let newItemObj;
    if (typeof image === "number") {
      newItemObj = {
        id: newId,
        title: itemName,
        quantity: quantity,
        image: image,
        dateAdded,
        expirationDate: expirationDate ? new Date(expirationDate).toISOString() : null
      };
    } else {
      newItemObj = {
        id: newId,
        title: itemName,
        quantity: quantity,
        image: { uri: image },
        dateAdded,
        expirationDate: expirationDate ? new Date(expirationDate).toISOString() : null
      };
    }

    // Update items array
    const updatedItems = [...items, newItemObj];

    // Save updated items to AsyncStorage
    await AsyncStorage.setItem('pantryItems', JSON.stringify(updatedItems));

    // Optionally schedule expiration notifications
    if (expirationDate) {
      // Note: scheduleExpirationNotifications needs to be imported or passed
      // For simplicity, we'll log a message here; actual implementation depends on Notifications module
      console.log(`Scheduling notification for ${itemName} with expiration ${expirationDate}`);
      // await scheduleExpirationNotifications(newItemObj);
    }

    return newItemObj; // Return the added item for confirmation
  } catch (error) {
    console.error('Error adding item to pantry:', error);
    throw error;
  }
};

export { addItemToPantry };