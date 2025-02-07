import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
const HomePage = ({}) => {
  return (
    <View style={styles.container}>
    <View style={styles.logoContainer}>
      <Text style={styles.logoText}>
        KITCHEN<Text style={styles.syncText}>Sync</Text>
      </Text>
    </View>
    <View style={styles.formContainer}>
      <TextInput style={styles.input} placeholder="Username" placeholderTextColor="#999" />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#999" secureTextEntry />
      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
      <Text style={styles.orText}>or Login with</Text>
      <View style={styles.socialButtons}>
        <TouchableOpacity>
          <Image
            source={{ uri: "https://img.icons8.com/color/48/facebook.png" }}
            style={styles.socialIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={{ uri: "https://img.icons8.com/color/48/google-logo.png" }}
            style={styles.socialIcon}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity>
        <Text style={styles.signupText}>Sign up</Text>
      </TouchableOpacity>
    </View>
  </View>
);
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: "#FFD580",
},
logoContainer: {
  marginTop: 80,
  alignItems: "center",
},
logoText: {
  fontSize: 36,
  fontWeight: "bold",
  color: "#8B0000",
},
syncText: {
  fontSize: 28,
  fontWeight: "normal",
  fontStyle: "italic",
},
formContainer: {
  marginTop: 40,
  paddingHorizontal: 20,
},
input: {
  height: 50,
  backgroundColor: "#FFF",
  borderRadius: 25,
  paddingHorizontal: 20,
  fontSize: 16,
  marginBottom: 15,
  borderWidth: 1,
  borderColor: "#ddd",
},
forgotPassword: {
  color: "#555",
  textAlign: "right",
  marginBottom: 20,
},
loginButton: {
  backgroundColor: "#008CBA",
  borderRadius: 25,
  paddingVertical: 15,
  alignItems: "center",
  marginBottom: 20,
},
loginButtonText: {
  color: "#FFF",
  fontSize: 16,
  fontWeight: "bold",
},
orText: {
  textAlign: "center",
  color: "#555",
  marginBottom: 10,
},
socialButtons: {
  flexDirection: "row",
  justifyContent: "center",
  marginBottom: 20,
},
socialIcon: {
  width: 48,
  height: 48,
  marginHorizontal: 10,
},
signupText: {
  textAlign: "center",
  color: "#8B0000",
  fontWeight: "bold",
},
});

export default HomePage;