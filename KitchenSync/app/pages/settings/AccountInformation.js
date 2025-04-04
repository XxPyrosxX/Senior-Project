import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, ActivityIndicator } from "react-native";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../../FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { enableNetwork } from "firebase/firestore";
import { AntDesign } from "@expo/vector-icons"; 


enableNetwork(FIREBASE_DB)
    .then(() => {
        console.log("Firestore network enabled");
    })
    .catch((error) => {
        console.error("Error enabling Firestore network:", error);
    });

const AccountSettings = () => {
    const navigation = useNavigation();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = FIREBASE_AUTH.currentUser;
                if (user) {
                    const userRef = doc(FIREBASE_DB, "users", user.uid);
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists()) {
                        setUserData(userSnap.data());
                    } else {
                        console.log("No user data found");
                    }
                } else {
                    console.log("No authenticated user found");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <ImageBackground
            source={require('../../../assets/images/kitchen_sync_bg.png')}
            style={styles.backgroundImage}
        >
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <AntDesign name="arrowleft" size={24} color="#8B0000" />
            </TouchableOpacity>

            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>
                        KITCHEN<Text style={styles.syncText}>Sync</Text>
                    </Text>
                </View>
            </View>

            <View style={styles.accountContainer}>
                {userData ? (
                    <>
                        <Text style={styles.title}>Account Information</Text>
                        <View style={styles.infoCard}>
                            <Text style={styles.infoLabel}>Name:</Text>
                            <Text style={styles.infoText}>{userData.name}</Text>
                        </View>
                        <View style={styles.infoCard}>
                            <Text style={styles.infoLabel}>Email:</Text>
                            <Text style={styles.infoText}>{userData.email}</Text>
                        </View>
                    </>
                ) : (
                    <Text>No user data available</Text>
                )}
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 62,
        left: 10,
        padding: 10,
        //backgroundColor: 'rgba(255,255,255,0.7)',
        borderRadius: 5,
        zIndex: 10,
    },
    backText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    container: {
        marginTop: 50,
        alignItems: 'center',
    },
    logoContainer: {
        marginBottom: 40,
        alignItems: "center",
    },
    logoText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#8B0000",
        marginTop: 20,
        textAlign: 'center',
    },
    syncText: {
        color: "#000",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    accountContainer: {
        width: '90%',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    infoCard: {
        width: '100%',
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    infoLabel: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    infoText: {
        fontSize: 18,
        color: "#555",
        marginTop: 5,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AccountSettings;