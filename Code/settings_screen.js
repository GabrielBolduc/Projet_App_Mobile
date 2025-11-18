import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Switch } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function settings(){

    const [isDarkMode, setIsDarkMode] = useState(false)
    const toggleSwitch = () =>setIsDarkMode(previousState => !previousState)
    
    return(
        <View style={styles.container}>

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Account settings</Text>
            </View>

            <View style={styles.profileSection}>
                <View style={styles.avatarContainer}>
                    <Ionicons name="person-outline" size={24} color="black" />
                </View>
            </View>
            <TouchableOpacity>
                <Text style={styles.editPhotoText}>Changer la photo</Text>
            </TouchableOpacity>

        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#F5F5F5', 
        alignItems: 'center',
    },
    header: {
        marginTop: 20,
        marginBottom: 40,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    profileSection: {
        alignItems: 'center',
        marginBottom: 50,
    },
    avatarContainer: {
        width: 120,
        height: 120,
        borderRadius: 60, 
        borderWidth: 2,
        borderColor: '#4A6572', 
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginBottom: 10,
    },
})