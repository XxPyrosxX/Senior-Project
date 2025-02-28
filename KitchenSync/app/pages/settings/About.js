import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ImageBackground, ScrollView, Modal, Button } from "react-native";

const About = () => {

    return (
        <ImageBackground
            source={require('../../../assets/images/Pantry_bg.png')}
            style={styles.backgroundImage}
        >
        
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Text style={styles.logoText}>
                    KITCHEN<Text style={styles.syncText}>Sync</Text>
                </Text>
            </View>
        </View>

        <View style={styles.aboutContainer}>
            <Text style={styles.aboutText}>
                ABOUT
            </Text>
        </View>

        <View style={styles.paragraphContainer}>
            <Text style={styles.paragraph}>
                KitchenSync is developed by a group of students at the University of Florida
                for their senior project. We all grocery shop and are aware of how an app like
                KitchenSync could organize shopping so as to create a simpler, stress-free
                experience.
            </Text>
        </View>
        
        </ImageBackground>
    )
    
};

const styles = StyleSheet.create({

    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
    },

    container: {
        marginTop: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
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

    aboutContainer: {
        marginTop: 30,
        marginBottom: 10,
        alignItems: 'center',
    },

    aboutText: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#8B0000",
        textAlign: 'center',
    },

    paragraphContainer: {
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 180,
        justifyContent: 'center',
        paddingHorizontal: 'center',
    },

    paragraph: {
        fontSize: 20,
        lineHeight: 28,
        color: '#333',
    }

})

export default About;