import React, {useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Button, KeyboardAvoidingView } from "react-native";
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
          
          <TextInput value= {email} style={styles.input} placeholder="Email" autoCapitalize= "none" onChangeText={(text) => setEmail(text)} />
          <TextInput secureTextEntry= {true} value= {password} style={styles.input} placeholder="Password"  autoCapitalize= "none" onChangeText={(text) => setPassword(text)} />
          
          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>
          {loading ?(
            <ActivityIndicator size="large" color="#000ff"/> 
          ) : (
          <>
          <Button title='Login' onPress={signIn} />
          </>
          )}


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
          <TouchableOpacity style={styles.signupButton} 
          onPress={() => navigation.navigate('CreateAccount')}
          >
            <Text style={styles.signupButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
   
  </View>
);}

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