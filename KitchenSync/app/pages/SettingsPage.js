import React from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground, Alert } from "react-native";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import { signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

const SettingsPage = ({}) => {
  const navigation = useNavigation();
  const auth = FIREBASE_AUTH;

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      Alert.alert("Success", "You have been logged out.");
      navigation.navigate('HomePage'); // Redirect to the HomePage or login screen
    } catch (error) {
      console.error("Logout failed:", error);
      Alert.alert("Error", "Logout failed. Please try again.");
    }
  };

  return (
    <>
      <ImageBackground
              source={require('../../assets/images/kitchen_sync_bg.png')}
              style={styles.backgroundImage}
      />  
      <View style={styles.container}>
        <Text style={styles.heading}>Settings</Text>
        <View style={styles.optionContainer}>
          <TouchableOpacity style={styles.option}
          onPress={() => navigation.navigate('AccountSettings')}>
            <Image
              source={{ uri: "https://img.icons8.com/ios-filled/50/user-male-circle.png" }}
              style={styles.icon}
            />
            <Text style={styles.optionText}>Account Information</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option}>
            <Image
              source={{ uri: "https://img.icons8.com/ios-filled/50/bell.png" }}
              style={styles.icon}
            />
            <Text style={styles.optionText}>Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option}>
            <Image
              source={{ uri: "https://img.icons8.com/ios-filled/50/visible.png" }}
              style={styles.icon}
            />
            <Text style={styles.optionText}>Appearance</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option}>
            <Image
              source={{ uri: "https://img.icons8.com/ios-filled/50/lock.png" }}
              style={styles.icon}
            />
            <Text style={styles.optionText}>Privacy and Security</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option}>
            <Image
              source={{ uri: "https://img.icons8.com/ios-filled/50/headphones.png" }}
              style={styles.icon}
            />
            <Text style={styles.optionText}>Help and Support</Text>
          </TouchableOpacity>
          {/* About */}
          <TouchableOpacity 
            style={styles.option}
            onPress={() => navigation.navigate('About')}
          > 
            <Image
              source={{ uri: "https://img.icons8.com/ios-filled/50/help.png" }}
              style={styles.icon}
            />
            <Text style={styles.optionText}>About</Text>
          </TouchableOpacity>
          
          {/* Logout */}
          <TouchableOpacity
            style={styles.option}
            onPress={handleLogout} // Call the logout function
          >
            <Image
              source={{ uri: "https://img.icons8.com/ios-filled/50/exit.png" }} // Updated icon for logout
              style={styles.icon}
            />
            <Text style={styles.optionText}>Logout</Text>
          </TouchableOpacity>
        </View>
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
  container: {
    flex: 1,
    //backgroundColor: "#FFD580",
  },
  heading: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#8B0000",
    textAlign: "center",
    marginTop: 55,
  },
  optionContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 15,
  },
  optionText: {
    fontSize: 18,
    color: "#8B0000",
  },
});

export default SettingsPage;
