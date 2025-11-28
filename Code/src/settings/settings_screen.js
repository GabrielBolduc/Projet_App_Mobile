import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; 
import { useAuth } from '../context/AuthContext'; 

const PRIMARY_COLOR = '#4A6572';

export default function Settings({ navigation }) {
  const { logout } = useAuth(); 
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleSwitch = () => setIsDarkMode(previousState => !previousState);

  const handleLogout = () => {
    logout();

    // reset la navigation
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        
        <View style={styles.headerContainer}>
           <Text style={styles.screenTitle}>Settings</Text>
        </View>
        
        <View style={styles.contentContainer}>

          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person-outline" size={60} color={PRIMARY_COLOR} />
            </View>
            <TouchableOpacity>
              <Text style={styles.editPhotoText}>Change the photo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.optionsContainer}>
            <View style={styles.optionRow}>
              <Text style={styles.optionLabel}>Dark mode</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#4A6572" }}
                thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
                onValueChange={toggleSwitch}
                value={isDarkMode}
              />
            </View>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutButtonText}>Logout</Text>
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
    backgroundColor: '#F5F5F5',
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
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
    borderColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
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
    color: '#333',
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#ccc',
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