import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { executeQuery } from '../services/api'; 
import { useAuth } from '../context/authContext'; 

const PRIMARY_COLOR = '#4A6572';

export default function Login({ navigation }) {
    const { login } = useAuth(); 
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert("Erreur", "Veuillez remplir tous les champs.");
            return;
        }

        setIsLoading(true);

        // appel api
        const result = await executeQuery('login_user', { 
            username: username, 
            password: password 
        });

        setIsLoading(false);

        if (result.success && result.data.length > 0) {
            const user = result.data[0];
            console.log("Connecté en tant que :", user.username);
            
            login(user);
            
            navigation.replace('Home'); 
        } else {
            Alert.alert("Échec", "Nom d'utilisateur ou mot de passe incorrect.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Bienvenue</Text>
                    <Text style={styles.subTitle}>Connectez-vous pour continuer</Text>
                </View>

                <View style={styles.inputContainer}>
                    <TextInput 
                        style={styles.input} 
                        placeholder="Nom d'utilisateur" 
                        placeholderTextColor="#999"
                        value={username}           
                        onChangeText={setUsername} 
                        autoCapitalize="none"
                    />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Mot de passe" 
                        secureTextEntry={true} 
                        placeholderTextColor="#999"
                        value={password}           
                        onChangeText={setPassword} 
                    />
                </View>

                <TouchableOpacity 
                    style={styles.primaryButton}
                    onPress={handleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.primaryButtonText}>Se connecter</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.secondaryButton}
                    onPress={() => navigation.navigate('Signup')}
                >
                    <Text style={styles.secondaryButtonText}>Créer un compte</Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: 
    { 
        flex: 1, 
        backgroundColor: '#F5F5F5' 
    },
    content: 
    { 
        flex: 1, 
        justifyContent: 'center', 
        paddingHorizontal: 30 
    },
    header: 
    { 
        marginBottom: 40, 
        alignItems: 'center' 
    },
    headerTitle: { fontSize: 32, fontWeight: 'bold', color: PRIMARY_COLOR, marginBottom: 10 },
    subTitle: { fontSize: 16, color: '#666' },
    inputContainer: { marginBottom: 20 },
    input: { backgroundColor: '#fff', borderColor: '#E0E0E0', borderWidth: 1, marginBottom: 15, borderRadius: 8, height: 50, paddingHorizontal: 15, fontSize: 16, color: '#333' },
    primaryButton: { backgroundColor: PRIMARY_COLOR, padding: 15, borderRadius: 25, alignItems: 'center', marginBottom: 15, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 3 },
    primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    secondaryButton: { padding: 15, borderRadius: 25, alignItems: 'center', borderWidth: 1, borderColor: PRIMARY_COLOR },
    secondaryButtonText: { color: PRIMARY_COLOR, fontSize: 16, fontWeight: '600' },
});