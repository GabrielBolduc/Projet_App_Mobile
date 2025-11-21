import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Switch , Button} from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

export default function settings(){

    const [isDarkMode, setIsDarkMode] = useState(false)
    const toggleSwitch = () =>setIsDarkMode(previousState => !previousState)

    return(
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Account settings</Text>
            </View>
            <View style={styles.profileSection}>
                <View style={styles.avatarContainer}>
                    <Ionicons name="person-outline" size={24} color="black" />
                </View>
                <TouchableOpacity>
                    <Text style={styles.editPhotoText}>Changer la photo</Text>
                </TouchableOpacity>
            </View>
            
            <View style={styles.optionsContainer}>
                <View style={styles.optionRow}>
                    <Text style={styles.optionLabel}>Dark mode</Text>
                    <Switch
                        trackColor={{false: "rgba(62, 60, 62, 0.33)", true: "rgba(17, 122, 187, 1)"}}
                        thumbColor={isDarkMode ? "#f6de48ff" : "#f4f3f4"}
                        onValueChange={toggleSwitch}
                        value={isDarkMode}
                    />
                </View>

                <View style={styles.divider}/>

                <TouchableOpacity style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.logoutButton}>
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
            </View>

          </SafeAreaView>
        </SafeAreaProvider>
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
        borderColor: '#4A6573', 
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    editPhotoText: {
        color: '#4A6573',
        fontWeight: '600',
    },
    optionsContainer: {
        width: '80%',
        alignItems: 'center'
    },
    optionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
        paddingHorizontal: 10
    },
    optionLabel:{
        fontSize: 18,
        color: '#333'
    },
    divider: {
        height: 1,
        width: '100%',
        backgroundColor: '#ccc',
        marginBottom: 30
    },
    saveButton: {
        width: '100%',
        backgroundColor: '#4A6573',
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 15
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    logoutButton: {
        width: '100%',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#D32F2f',
        padding: 13,
        borderRadius: 25,
        alignItems: 'center'
    },
    logoutButtonText: {
        color: '#D32F3f',
        fontSize: 16,
        fontFamily: 'bold'
    }

    
})