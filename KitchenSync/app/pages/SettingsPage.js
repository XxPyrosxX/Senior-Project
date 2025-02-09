import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

const SettingsPage = ({}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Settings</Text>
      <View style={styles.optionContainer}>
        <TouchableOpacity style={styles.option}>
          <Image
            source={{ uri: "https://img.icons8.com/ios-filled/50/user-male-circle.png" }}
            style={styles.icon}
          />
          <Text style={styles.optionText}>Account Settings</Text>
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
        <TouchableOpacity style={styles.option}>
          <Image
            source={{ uri: "https://img.icons8.com/ios-filled/50/help.png" }}
            style={styles.icon}
          />
          <Text style={styles.optionText}>About</Text>
        </TouchableOpacity>
      </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFD580",
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
