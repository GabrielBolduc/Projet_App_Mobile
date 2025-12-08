import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { executeQuery } from '../services/api';
import { useAuth } from '../context/authContext';

const PRIMARY_COLOR = '#4A6572';

const fetchRandomProfilePicture = () => {
    const gender = Math.random() < 0.5 ? 'men' : 'women';
    const index = Math.floor(Math.random() * 99) + 1; 
    
    return `https://randomuser.me/api/portraits/${gender}/${index}.jpg`;
};

export default function Signup({ navigation }) {
    
    const { login } = useAuth();
    
    const [profilePhotoUri, setProfilePhotoUri] = useState(null); 
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAvatarPress = () => {
        const newUrl = fetchRandomProfilePicture();
        setProfilePhotoUri(newUrl); 
        Alert.alert("Photo sélectionnée", `Nouvelle URL: ${newUrl}`);
    };

    const handleSignup = async () => {
        if (!username || !password || !confirmPassword) {
            Alert.alert("Erreur", "Veuillez remplir tous les champs.");
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
            return;
        }

        setIsLoading(true);

        const photo_profile = profilePhotoUri || '';
        
        const result = await executeQuery('create_user', {
            username: username,
            password: password,
            photo_profile: photo_profile 
        });

        if (result.success) {
            
            const loginResult = await executeQuery('login_user', {
                username: username,
                password: password
            });

            setIsLoading(false);

            if (loginResult.success && loginResult.data.length > 0) {
                const user = loginResult.data[0];
                login(user);
                
                Alert.alert(
                    "Succès", 
                    "Compte créé et connexion réussie !", 
                    [{ text: "OK", onPress: () => navigation.replace('Home') }]
                );
            } else {
                Alert.alert(
                    "Succès", 
                    "Compte créé. Veuillez vous connecter manuellement.", 
                    [{ text: "OK", onPress: () => navigation.replace('Login') }]
                );
            }

        } else {
            setIsLoading(false);
            console.error("Erreur d'inscription:", result.error);
            Alert.alert("Erreur", "Impossible de créer le compte. Ce nom est peut-être déjà pris.");
        }
    };

    const hasProfilePic = !!profilePhotoUri; 

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>

                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Créer un compte</Text>
                    <Text style={styles.subTitle}>Rejoignez la communauté !</Text>
                </View>

                <View style={styles.profileSection}>
                    <TouchableOpacity style={styles.avatarContainer} onPress={handleAvatarPress}>
                        
                        {hasProfilePic ? (
                            <Image 
                                source={{ uri: profilePhotoUri }} 
                                style={styles.profileImage}
                            />
                        ) : (
                            <Ionicons name="camera-outline" size={40} color="#999" />
                        )}

                        <View style={styles.addIconBadge}>
                            <Ionicons name="add" size={16} color="#fff" />
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.avatarText}>
                        {hasProfilePic ? "Photo sélectionnée !" : "Ajouter une photo"}
                    </Text>
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
                    <TextInput 
                        style={styles.input} 
                        placeholder="Confirmer le mot de passe" 
                        secureTextEntry={true} 
                        placeholderTextColor="#999"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                </View>
                
                <TouchableOpacity 
                    style={styles.primaryButton}
                    onPress={handleSignup}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.primaryButtonText}>S'inscrire</Text>
                    )}
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
    container: { flex: 1, backgroundColor: '#F5F5F5' },
    content: { flex: 1, justifyContent: 'center', paddingHorizontal: 30 },
    header: { marginBottom: 30, alignItems: 'center' },
    headerTitle: { fontSize: 32, fontWeight: 'bold', color: PRIMARY_COLOR, marginBottom: 5 },
    subTitle: { fontSize: 16, color: '#666' },
    profileSection: { alignItems: 'center', marginBottom: 30 },
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
        shadowColor: "#000", 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.1, 
        shadowRadius: 3, 
        elevation: 2 
    },
    profileImage: {
        width: '100%', 
        height: '100%', 
        borderRadius: 50,
    },
    addIconBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: PRIMARY_COLOR, width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
    avatarText: { color: PRIMARY_COLOR, fontSize: 14, fontWeight: '600' },
    inputContainer: { marginBottom: 20 },
    input: { backgroundColor: '#fff', borderColor: '#E0E0E0', borderWidth: 1, marginBottom: 15, borderRadius: 8, height: 50, paddingHorizontal: 15, fontSize: 16, color: '#333' },
    primaryButton: { backgroundColor: PRIMARY_COLOR, padding: 15, borderRadius: 25, alignItems: 'center', marginBottom: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 3 },
    primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    linkButton: { alignItems: 'center', padding: 10 },
    linkText: { color: '#666', fontSize: 14 }
});