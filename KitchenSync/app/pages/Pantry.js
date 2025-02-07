import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ImageBackground } from "react-native";

const Pantry = ({}) => {
    return (
        <>
        <ImageBackground
                source={require('../../assets/images/Pantry_bg.png')}
                style={styles.backgroundImage}
            />
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Text style={styles.logoText}>
                    KITCHEN<Text style={styles.syncText}>Sync</Text>
                </Text>
            </View>
        </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    logoContainer: {
    marginTop: 30,
    marginLeft: 20,
    alignItems: "left",
    },

    logoText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#8B0000",
    },

    backgroundImage: {
        flex: .90,
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
});

export default Pantry;