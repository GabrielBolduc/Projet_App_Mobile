import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; 
import { useAuth, Colors } from '../context/authContext'; 
import { executeQuery } from '../services/api';

const PRIMARY_COLOR = '#4A6572';

export default function Settings({ navigation }) {
  const { user, logout, login } = useAuth(); 
  
  // initialiser local state avec bool
  const [isDarkMode, setIsDarkMode] = useState(Boolean(user?.dark_mode_enabled));
  const [isSaving, setIsSaving] = useState(false);

  const theme = isDarkMode ? Colors.dark : Colors.light;

  const toggleSwitch = () => setIsDarkMode(previousState => !previousState);

  // Save modif
  const handleSave = async () => {
    setIsSaving(true);
    try {
        await executeQuery('update_dark_mode', {
            status: isDarkMode ? 1 : 0,
            user_id: user.id
        });

        login({ ...user, dark_mode_enabled: isDarkMode ? 1 : 0 });

    } catch (e) {
        Alert.alert("Erreur", "Impossible de sauvegarder la préférence.");
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
      {/* theme */}
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        
        <View style={[styles.headerContainer, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
           <Text style={styles.screenTitle}>Paramètres</Text>
        </View>
        
        <View style={styles.contentContainer}>

          <View style={styles.profileSection}>
            <View style={[styles.avatarContainer, { backgroundColor: theme.card, borderColor: PRIMARY_COLOR }]}>
                <Ionicons name="person-outline" size={60} color={PRIMARY_COLOR} />
            </View>
            <TouchableOpacity>
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