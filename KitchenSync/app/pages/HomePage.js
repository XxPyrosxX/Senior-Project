import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

const HomePage = ({}) => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
    } catch (error) {
      console.log(error);
      alert('Sign in failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      console.log(response);
      alert('Check your email!');
    } catch (error) {
      console.log(error);
      alert('Sign up failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>
          KITCHEN<Text style={styles.syncText}>Sync</Text>
        </Text>
        <Image
          source={require('../../assets/images/Logo.png')}
          style={{ width: 350, height: 250 }}
        />
      </View>
      <View style={styles.formContainer}>
        <TextInput
          value={email}
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#666" 
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          secureTextEntry={true}
          value={password}
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#666" 
          autoCapitalize="none"
          onChangeText={(text) => setPassword(text)}
        />

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>


        {loading ? (
          <ActivityIndicator size="large" color="#000ff" />
        ) : (
          <>
            <TouchableOpacity style={styles.loginButton} onPress={signIn}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </>
        )}

          <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>
        
        <TouchableOpacity onPress={() => navigation.navigate('CreateAccount')}>
          <Text style={styles.signup}>Don't have an account?</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => navigation.navigate('CreateAccount')}
        >
          <Text style={styles.signupButtonText}>Sign Up</Text>
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
  logoContainer: {
    marginTop: 80,
    alignItems: "center",
  },
  logoText: {
    fontSize: 44,
    fontWeight: "bold",
    color: "#8B0000",
  },
  syncText: {
    fontSize: 32,
    fontWeight: "normal",
    fontStyle: "italic",
    color: "#000000",
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
    color: "#000", // Text color for user input
  },
  forgotPassword: {
    color: "#555",
    textAlign: "right",
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: "#008CBA", // Blue color for the login button
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
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'black',
  },
  dividerText: {
    marginHorizontal: 10,
    color: 'black',
    fontSize: 14,
  },
  signup: {
    color: '#666',
    textAlign: 'center',
    fontSize: 15,
  },
  signupHighlight: {
    color: '#D64527',
    fontWeight: '600',
  },
  signupText: {
    textAlign: "center",
    color: "#8B0000",
    fontWeight: "bold",
  },
  signupButton: {
    backgroundColor: "#FFA500",
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
  },
  signupButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HomePage;