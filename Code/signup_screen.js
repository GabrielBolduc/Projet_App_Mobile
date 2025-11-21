import React from 'react';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';


export default function SignupScreen() {

  const [buttonPressed, setButtonPressed] = React.useState(false);

  const handleAvatarPress = () => {
    setButtonPressed(buttonPressed ? false : true);
  }

  const handleAvatarShow = () => {
    if (buttonPressed) {
      return (
        <View style={styles.avatarContainer}>
            <Ionicons name="person-circle-outline" size={100} color="#4A6572" />
        </View>
      );
    }
    return null;
  }
  
  return (
    <SafeAreaProvider>
        <SafeAreaView style={styles.container}>

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Sign Up</Text>
            </View>

            <TextInput style={styles.input} placeholder="Username" />
            <TextInput style={styles.input} placeholder="Password" secureTextEntry={true} />
            <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry={true} />

            <View style={styles.profileSection}>
                
                {handleAvatarShow()}

                <TouchableOpacity style={[styles.button, { height: 55, width: 200}] } onPress={handleAvatarPress}>
                    <Text style={styles.buttonText}>Add Profile Picture</Text>
                </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
        </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0d4b0ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
      marginBottom: 40,
  },
  headerTitle: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#4A6572',
  },
  input: {
    borderColor: 'darkgray',
    borderWidth: 2,
    marginBottom: 24,
    borderRadius: 4,
    height: 60,
    width: 250,
    paddingLeft: 8,
    paddingRight: 8,
  },
  button: {
    backgroundColor: '#f3ca89ff',
    padding: 16,
    margin: 16,
    borderRadius: 32,
    height: 60,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
    buttonText: {
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  profileSection: {
      flexDirection: 'row',
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
    marginRight: 16,
  },
});
