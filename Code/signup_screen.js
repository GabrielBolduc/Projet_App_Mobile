import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

const PRIMARY_COLOR = '#4A6572';

export default function SignupScreen({ navigation }) {

  // Simulation d'état pour la photo de profil (vide ou remplie)
  const [hasProfilePic, setHasProfilePic] = useState(false);

  const handleAvatarPress = () => {
    setHasProfilePic(!hasProfilePic);
  }

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.content}>

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Créer un compte</Text>
                <Text style={styles.subTitle}>Rejoignez la communauté !</Text>
            </View>

            {/* Section Photo de profil modernisée */}
            <View style={styles.profileSection}>
                <TouchableOpacity style={styles.avatarContainer} onPress={handleAvatarPress}>
                    {hasProfilePic ? (
                        <Ionicons name="person" size={60} color={PRIMARY_COLOR} />
                    ) : (
                        <Ionicons name="camera-outline" size={40} color="#999" />
                    )}
                    {/* Petit indicateur "+" */}
                    <View style={styles.addIconBadge}>
                        <Ionicons name="add" size={16} color="#fff" />
                    </View>
                </TouchableOpacity>
                <Text style={styles.avatarText}>
                    {hasProfilePic ? "Photo ajoutée !" : "Ajouter une photo"}
                </Text>
            </View>

            {/* Formulaire */}
            <View style={styles.inputContainer}>
                <TextInput 
                    style={styles.input} 
                    placeholder="Nom d'utilisateur" 
                    placeholderTextColor="#999"
                />
                <TextInput 
                    style={styles.input} 
                    placeholder="Mot de passe" 
                    secureTextEntry={true} 
                    placeholderTextColor="#999"
                />
                <TextInput 
                    style={styles.input} 
                    placeholder="Confirmer le mot de passe" 
                    secureTextEntry={true} 
                    placeholderTextColor="#999"
                />
            </View>
            
            <TouchableOpacity 
                style={styles.primaryButton}
                // Ici, on pourrait imaginer une navigation vers Home après validation
                onPress={() => navigation.replace('Home')}
            >
                <Text style={styles.primaryButtonText}>S'inscrire</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.linkButton} 
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.linkText}>Déjà un compte ? Se connecter</Text>
            </TouchableOpacity>

        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 30,
  },
  header: {
      marginBottom: 30,
      alignItems: 'center',
  },
  headerTitle: {
      fontSize: 32,
      fontWeight: 'bold',
      color: PRIMARY_COLOR,
      marginBottom: 5,
  },
  subTitle: {
      fontSize: 16,
      color: '#666',
  },
  profileSection: {
      alignItems: 'center',
      marginBottom: 30,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50, 
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 10,
    // Ombre légère
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2,
  },
  addIconBadge: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: PRIMARY_COLOR,
      width: 30,
      height: 30,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#fff',
  },
  avatarText: {
      color: PRIMARY_COLOR,
      fontSize: 14,
      fontWeight: '600',
  },
  inputContainer: {
      marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#E0E0E0',
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 8,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
  },
  primaryButton: {
    backgroundColor: PRIMARY_COLOR,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 3,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
      alignItems: 'center',
      padding: 10,
  },
  linkText: {
      color: '#666',
      fontSize: 14,
  }
});