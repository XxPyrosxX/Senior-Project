import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";


export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const auth = FIREBASE_AUTH;
  const navigation = useNavigation();


  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert("Enter your email to reset password.");
      return;
    }


    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Success", "Password reset link sent to your email.");
      navigation.goBack(); 
    } catch (error) {
      console.error(error);
      Alert.alert("Error", error.message);
    }
  };


  return (
    <>
    <View style={styles.logoContainer}>
        <Text style={styles.logoText}>
          KITCHEN<Text style={styles.syncText}>Sync</Text>
        </Text>
      </View>

      
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color="#8B0000" />
      </TouchableOpacity>
    <View style={styles.container}>
      
      <Text style={styles.title}>Reset Your Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#666"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
        <Text style={styles.buttonText}>Send Reset Link</Text>
      </TouchableOpacity>
    </View>

    </>

    
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFD580",
    //justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logoContainer: {
    
    marginBottom: 20,
    alignItems: "center",
  },
  logoText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#8B0000",
    marginTop: 40,
  },
  syncText: {
    fontSize: 32,
    fontWeight: "normal",
    fontStyle: "italic",
    color: "#000000",
  },
  title: {
    marginTop: 240,
    fontSize: 22,
    fontWeight: "bold",
    color: "#8B0000",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    color: "#000",
  },
  button: {
    backgroundColor: "#34A853",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 10,
    padding: 10,
    //backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 5,
    zIndex: 10,
  },
  backText: {
    fontSize: 16,
    fontWeight: "bold",
  }
});
