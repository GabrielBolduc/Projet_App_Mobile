import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert, ActivityIndicator, Image, Linking } from 'react-native'; 
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; 
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker
import { useAuth, Colors } from '../context/authContext'; 
import { executeQuery } from '../services/api';

const PRIMARY_COLOR = '#4A6572';

export default function Settings({ navigation }) {
  const { user, logout, login } = useAuth(); 
  
  const [isDarkMode, setIsDarkMode] = useState(Boolean(user?.dark_mode_enabled));
  const [profilePhoto, setProfilePhoto] = useState(user?.photo_profile || null);
  const [isSaving, setIsSaving] = useState(false);

  // theme dynamique
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const toggleSwitch = () => setIsDarkMode(previousState => !previousState);

  // changement photo
  const handleChangePhoto = async () => {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
          Alert.alert(
              "Permission requise",
              "L'accès à la galerie est nécessaire. Voulez-vous ouvrir les paramètres pour l'autoriser ?",
              [
                  { text: "Annuler", style: "cancel" },
                  { 
                      text: "Ouvrir les paramètres", 
                      onPress: () => Linking.openSettings()
                  }
              ]
          );
          return;
      }

      // ouvrir galerie
      const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images, // Standardisé
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.1, 
          base64: true,
      });

      if (!result.canceled) {
          const imageUri = `data:image/jpeg;base64,${result.assets[0].base64}`;
          setProfilePhoto(imageUri);
      }
  };
  const handleSave = async () => {
    setIsSaving(true);
    try {
        // save du dark mode
        await executeQuery('update_dark_mode', {
            status: isDarkMode ? 1 : 0,
            user_id: user.id
        });

        // save de la photo
        if (profilePhoto !== user?.photo_profile) {
            await executeQuery('update_profile_picture', {
                photo_profile: profilePhoto,
                user_id: user.id
            });
        }

        login({ 
            ...user, 
            dark_mode_enabled: isDarkMode ? 1 : 0,
            photo_profile: profilePhoto
        });

        Alert.alert("Succès", "Vos préférences ont été enregistrées.");

    } catch (e) {
        console.error(e);
        Alert.alert("Erreur", "Impossible de sauvegarder les modifications.");
    } finally {
        setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        
        <View style={[styles.headerContainer, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
           <Text style={styles.screenTitle}>Paramètres</Text>
        </View>
        
        <View style={styles.contentContainer}>

          <View style={styles.profileSection}>
            <TouchableOpacity 
                style={[styles.avatarContainer, { backgroundColor: theme.card, borderColor: PRIMARY_COLOR }]}
                onPress={handleChangePhoto}
            >
                {profilePhoto ? (
                    <Image 
                        source={{ uri: profilePhoto }} 
                        style={styles.avatarImage} 
                    />
                ) : (
                    <Ionicons name="person-outline" size={60} color={PRIMARY_COLOR} />
                )}
                
                <View style={styles.addIconBadge}>
                    <Ionicons name="camera" size={14} color="#fff" />
                </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleChangePhoto}>
              <Text style={styles.editPhotoText}>Changer votre photo</Text>
            </TouchableOpacity>
            
            <Text style={{ color: theme.subText, marginTop: 5, fontSize: 16 }}>
                {user?.username}
            </Text>
          </View>

          <View style={styles.optionsContainer}>
            <View style={styles.optionRow}>
              <Text style={[styles.optionLabel, { color: theme.text }]}>Mode sombre</Text>
              <Switch
                trackColor={{ false: "#767577", true: PRIMARY_COLOR }}
                thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isDarkMode}
              />
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <TouchableOpacity 
                style={styles.saveButton} 
                onPress={handleSave}
                disabled={isSaving}
            >
              {isSaving ? (
                  <ActivityIndicator color="#fff" />
              ) : (
                  <Text style={styles.saveButtonText}>Sauvegarder</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutButtonText}>Déconnexion</Text>
            </TouchableOpacity>
          </View>
        </View>

      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative', 
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  addIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: PRIMARY_COLOR,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  editPhotoText: {
    color: PRIMARY_COLOR,
    fontWeight: '600',
  },
  optionsContainer: {
    width: '85%',
    alignItems: 'center',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  optionLabel: {
    fontSize: 18,
  },
  divider: {
    height: 1,
    width: '100%',
    marginBottom: 30,
  },
  saveButton: {
    width: '100%',
    backgroundColor: PRIMARY_COLOR,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#D32F2F',
    padding: 13,
    borderRadius: 25,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#D32F2F',
    fontSize: 16,
    fontWeight: 'bold',
  },
});