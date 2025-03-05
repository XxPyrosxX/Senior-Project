import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import HomePage from "./HomePage";

export default function CreateAccountScreen() {
  const [email, setEmail] = useState("Email");
  const [fullName, setFullName] = useState("Full Name");
  const [username, setUsername] = useState("Username");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>KITCHEN <Text style={styles.sync}>Sync</Text></Text>
      <Text style={styles.title}>CREATE YOUR ACCOUNT</Text>

      {/* Back Button at the top left */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        onFocus={() => email === "Email" && setEmail("")}
        onBlur={() => email === "" && setEmail("Email")}
      />

      <TextInput
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
        onFocus={() => fullName === "Full Name" && setFullName("")}
        onBlur={() => fullName === "" && setFullName("Full Name")}
      />

      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        onFocus={() => username === "Username" && setUsername("")}
        onBlur={() => username === "" && setUsername("Username")}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          value={passwordFocused || password ? password : "Password"}
          onChangeText={setPassword}
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
          secureTextEntry={passwordFocused && !passwordVisible}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <MaterialIcons name={passwordVisible ? "visibility" : "visibility-off"} size={24} color="gray" />
        </TouchableOpacity>
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          value={confirmPasswordFocused || confirmPassword ? confirmPassword : "Confirm Password"}
          onChangeText={setConfirmPassword}
          onFocus={() => setConfirmPasswordFocused(true)}
          onBlur={() => setConfirmPasswordFocused(false)}
          secureTextEntry={confirmPasswordFocused && !confirmPasswordVisible}
        />
        <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
          <MaterialIcons name={confirmPasswordVisible ? "visibility" : "visibility-off"} size={24} color="gray" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#B74E34",
  },
  sync: {
    fontStyle: "italic",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#B74E34",
    marginVertical: 20,
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 25,
    marginVertical: 10,
    color: "#000",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 25,
    marginVertical: 10,
  },
  passwordInput: {
    flex: 1,
  },
  button: {
    backgroundColor: "#34A853",
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
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
});
