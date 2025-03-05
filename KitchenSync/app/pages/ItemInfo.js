import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useRouter } from 'expo-router';

// Removed fetchFoodImage function since we no longer re-fetch the image

// --------------------------------------------------------------------
// Function to fetch nutritional info using the CalorieNinja API (unchanged)
// --------------------------------------------------------------------
const CALORIENINJA_API_KEY = "LLew1ywTsyGT1GAwBl0zHg==n1YiL8iF91CWY2Bq";

const fetchNutritionFromCalorieNinja = async (foodQuery) => {
  try {
    const response = await fetch(
      `https://api.calorieninjas.com/v1/nutrition?query=${encodeURIComponent(foodQuery)}`,
      {
        headers: { "X-Api-Key": CALORIENINJA_API_KEY },
      }
    );
    const data = await response.json();
    if (data && data.items && data.items.length > 0) {
      const item = data.items[0];
      return (
        `Serving Size: ${item.serving_size_g || "N/A"} g\n` +
        `Calories: ${item.calories} cal\n` +
        `Protein: ${item.protein_g} g\n` +
        `Fat: ${item.fat_total_g} g\n` +
        `Carbohydrates: ${item.carbohydrates_total_g} g`
      );
    } else {
      return "Nutritional information not available.";
    }
  } catch (error) {
    console.error("Error fetching CalorieNinja nutrition info:", error);
    return "Error fetching nutritional information.";
  }
};

// Helper function to normalize the image source
const getImageSource = (img) => {
  if (typeof img === 'number') return img;
  if (typeof img === 'string') return { uri: img };
  if (typeof img === 'object' && img.uri) return img;
  return require("../../assets/images/default.png");
};

// --------------------------------------------------------------------
//  Main component: PantryItemDetails
// --------------------------------------------------------------------
export default function PantryItemDetails() {
  const route = useRoute();
  // Extract title, quantity, image, and dateAdded passed from Pantry.
  const { title, quantity, image, dateAdded } = route.params || {};
  const router = useRouter();

  // Placeholder for expiration date
  const expirationDate = "N/A";

  const [itemImage, setItemImage] = useState(null);
  const [nutritionalInfo, setNutritionalInfo] = useState(null);
  const [loadingNutrition, setLoadingNutrition] = useState(true);
  const [loadingImage, setLoadingImage] = useState(true);

  useEffect(() => {
    // Directly use the image passed from Pantry.
    if (image) {
      setItemImage(getImageSource(image));
    } else {
      setItemImage(require("../../assets/images/default.png"));
    }
    setLoadingImage(false);

    // Fetch the nutritional info using CalorieNinja API.
    if (title) {
      fetchNutritionFromCalorieNinja(title).then((info) => {
        setNutritionalInfo(info);
        setLoadingNutrition(false);
      });
    } else {
      setLoadingNutrition(false);
    }
  }, [route.params]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('pages/Pantry')}>
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.detailContainer}>
        {loadingImage ? (
          <ActivityIndicator size="large" color="#006400" />
        ) : (
          itemImage && (
            <Image
              source={itemImage}
              style={styles.itemImage}
            />
          )
        )}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.info}>Quantity: {quantity || 'N/A'}</Text>
        <Text style={styles.info}>
          Date Added: {dateAdded ? new Date(dateAdded).toLocaleDateString() : "N/A"}
        </Text>
        <Text style={styles.info}>Expiration Date: {expirationDate}</Text>
        <Text style={styles.info}>Nutritional Information:</Text>
        {loadingNutrition ? (
          <ActivityIndicator size="small" color="#006400" />
        ) : (
          <Text style={styles.nutrition}>{nutritionalInfo}</Text>
        )}
      </View>
    </View>
  );
}

// --------------------------------------------------------------------
// Styles
// --------------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1, // fill the screen
    padding: 20,
    backgroundColor: '#FFFACD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 10,
    padding: 10,
    backgroundColor: '#FFFACD',
    borderRadius: 5,
    zIndex: 10,
  },
  backText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailContainer: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderColor: '#006400',
    borderWidth: 2,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  itemImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B0000',
    marginBottom: 10,
    textAlign: 'center',
  },
  info: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  nutrition: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
});
