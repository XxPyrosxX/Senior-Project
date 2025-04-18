import React from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  Alert
} from "react-native";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import { signOut } from "firebase/auth";

const SettingsPage = () => {
  const navigation = useNavigation();
  const auth = FIREBASE_AUTH;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("Success", "You have been logged out.");
      navigation.navigate("HomePage");
    } catch (error) {
      console.error("Logout failed:", error);
      Alert.alert("Error", "Logout failed. Please try again.");
    }
  };

  const settingsOptions = [
    {
      title: "Account Information",
      icon: "https://img.icons8.com/ios-filled/50/user-male-circle.png",
      onPress: () => navigation.navigate("AccountSettings"),
    },
    {
      title: "About",
      icon: "https://img.icons8.com/ios-filled/50/help.png",
      onPress: () => navigation.navigate("About"),
    },
    {
      title: "Logout",
      icon: "https://img.icons8.com/ios-filled/50/exit.png",
      onPress: handleLogout,
    },
  ];

  return (
    <ImageBackground
      source={require("../../assets/images/kitchen_sync_bg.png")}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        {/* Your settings UI lives inside this overlay */}
        <Text style={styles.heading}>Settings</Text>
        <View style={styles.optionContainer}>
          {settingsOptions.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={item.onPress}
              activeOpacity={0.8}
            >
              <View style={styles.option}>
                <Image source={{ uri: item.icon }} style={styles.icon} />
                <Text style={styles.optionText}>{item.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
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
  overlay: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#8B0000",
    textAlign: "center",
    marginBottom: 30,
  },
  optionContainer: {
    gap: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 28,
    height: 28,
    marginRight: 15,
    tintColor: "#8B0000",
  },
  optionText: {
    fontSize: 18,
    color: "#8B0000",
    fontWeight: "600",
  },
});

export default SettingsPage;
