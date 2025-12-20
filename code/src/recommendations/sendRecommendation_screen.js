import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { executeQuery } from '../services/api'; 
import { useAuth } from '../context/authContext'; 

const EMOJI_OPTIONS = [
    { value: '🏆', icon: '🏆', name: "Chef d'œuvre" },
    { value: '😍', icon: '😍', name: "J'adore" },
    { value: '❤️', icon: '❤️', name: "Coup de cœur" },
    { value: '🚀', icon: '🚀', name: "Sensationnel" },
    { value: '😂', icon: '😂', name: "Hilarant" },
    { value: '🤯', icon: '🤯', name: "Époustouflant" },
    { value: '🥺', icon: '🥺', name: "Émouvant" },
    { value: '😱', icon: '😱', name: "Effrayant" },
    { value: '😴', icon: '😴', name: "Ennuyant" },
    { value: '🤔', icon: '🤔', name: "Intrigant" },
    { value: '🍿', icon: '🍿', name: "Divertissant" },
    { value: '🤮', icon: '🤮', name: "Mauvais" },
];

export default function SendRecommendationScreen({ navigation, route }) {
    const { user, theme } = useAuth(); 
    
    // si recommandation présent, mode edit
    const { recommendation } = route.params || {};
    const isEditMode = !!recommendation;

    const [explanation, setExplanation] = useState(recommendation?.message || '');
    const [selectedEmoji, setSelectedEmoji] = useState(recommendation?.emoji || null);
    
    const [selectedFriend, setSelectedFriend] = useState(
        recommendation ? { id: recommendation.receiver_id, name: recommendation.receiver_name } : null
    );
    const [selectedMovie, setSelectedMovie] = useState(
        recommendation ? { id: recommendation.movie_id, title: recommendation.movie_title } : null
    );

    const [friendsList, setFriendsList] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isFriendDropdownOpen, setIsFriendDropdownOpen] = useState(false);

    // charger données initiales
    useEffect(() => {
        const loadData = async () => {
            if (!user) return;
            try {
                const friendsRes = await executeQuery('get_my_friends', { user_id: user.id });
                let formattedFriends = [];
                if (friendsRes.success) {
                    formattedFriends = friendsRes.data.map(f => ({
                        id: f.id,
                        name: f.username,
                        photo_profile: f.photo_profile
                    }));
                    setFriendsList(formattedFriends);

                    // Si en mode édition, pré-sélectionner l'ami
                    if (isEditMode && recommendation) {
                        const fullFriend = formattedFriends.find(f => f.id === recommendation.receiver_id);
                        if (fullFriend) setSelectedFriend(fullFriend);
                    }
                }
            } catch (e) {
                console.error("Error loading data:", e);
                Alert.alert("Erreur", "Impossible de charger les amis");
            } finally {
                setLoadingData(false);
            }
        };
        loadData();
    }, [user]);

    // sauvegarder / mettre à jour recommandation
    const handleSave = async () => {
        if (!selectedMovie || !explanation || !selectedFriend || !selectedEmoji) {
            Alert.alert("Erreur", "Vous devez remplir tous les champs");
            return;
        }

        setIsSaving(true);
        try {
            let result;
            
            if (isEditMode) {
                // mettre à jour existant
                result = await executeQuery('update_recommendation', {
                    id: recommendation.id,
                    sender_id: user.id,
                    receiver_id: selectedFriend.id,
                    movie_id: selectedMovie.id,
                    message: explanation,
                    emoji: selectedEmoji
                });
            } else {
                // créer nouveau
                result = await executeQuery('send_recommendation', {
                    sender_id: user.id,
                    receiver_id: selectedFriend.id,
                    movie_id: selectedMovie.id,
                    message: explanation,
                    emoji: selectedEmoji
                });
            }

            if (result.success) {
                Alert.alert(
                    "Succès", 
                    isEditMode ? "Recommandation modifiée !" : `Recommandation envoyée à ${selectedFriend.name}!`,
                    [{ text: "OK", onPress: () => navigation.goBack() }]
                );
            } else {
                Alert.alert("Erreur", "Une erreur est survenue.");
            }
        } catch (e) {
            console.error("Error saving:", e);
            Alert.alert("Erreur", "Problème de connexion.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSelectFriend = (friend) => {
        setSelectedFriend(friend);
        setIsFriendDropdownOpen(false);
    };

    const handleMovieSelect = (movie) => {
        setSelectedMovie(movie);
    };

    // naviguer vers MovieList pour selection film
    const openMovieSelector = () => {
        navigation.navigate('MovieList', { 
            returnScreen: 'SendRecommendation',
            onSelect: handleMovieSelect
        });
    };

    if (loadingData) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.primary} style={{marginTop: 50}} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            
            <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.primary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.primary }]}>
                    {isEditMode ? "Modifier" : "Nouvelle recommandation"}
                </Text>
                <View style={{ width: 24 }} /> 
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* --- SELECTION AMI --- */}
                <Text style={[styles.label, { color: theme.subText }]}>Pour qui ?</Text>
                <TouchableOpacity 
                    style={[styles.input, styles.dropdownTrigger, { backgroundColor: theme.card, borderColor: theme.border }]}
                    onPress={() => setIsFriendDropdownOpen(!isFriendDropdownOpen)}
                    activeOpacity={0.7}
                >
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        {selectedFriend && selectedFriend.photo_profile ? (
                            <View style={[styles.avatarContainerSmall, { marginRight: 10 }]}>
                                <Image source={{ uri: selectedFriend.photo_profile }} style={styles.profileImageSmall} />
                            </View>
                        ) : (
                            <Ionicons name="person-outline" size={20} color={selectedFriend ? theme.primary : theme.subText} style={{ marginRight: 10 }} />
                        )}
                        <Text style={{ color: selectedFriend ? theme.text : theme.subText, fontSize: 16 }}>
                            {selectedFriend ? selectedFriend.name : "Sélectionner un ami"}
                        </Text>
                    </View>
                    <Ionicons name={isFriendDropdownOpen ? "chevron-up" : "chevron-down"} size={20} color={theme.subText} />
                </TouchableOpacity>

                {isFriendDropdownOpen && (
                    <View style={[styles.dropdownList, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <ScrollView nestedScrollEnabled={true} style={{ maxHeight: 200 }}>
                            {friendsList.length === 0 ? (
                                <Text style={{padding:15, color: theme.subText, textAlign:'center'}}>Aucun ami trouvé.</Text>
                            ) : (
                                friendsList.map((friend) => (
                                    <TouchableOpacity 
                                        key={friend.id} 
                                        style={[styles.dropdownItem, { borderBottomColor: theme.border, backgroundColor: theme.card }]}
                                        onPress={() => handleSelectFriend(friend)}
                                    >
                                        <View style={[styles.avatarContainerSmall, {backgroundColor: theme.background}]}>
                                            {friend.photo_profile ? (
                                                <Image source={{ uri: friend.photo_profile }} style={styles.profileImageSmall} />
                                            ) : (
                                                <Ionicons name="person-circle" size={30} color={theme.primary} />
                                            )}
                                        </View>
                                        <Text style={[styles.dropdownItemText, { color: theme.text }]}>{friend.name}</Text>
                                        {selectedFriend?.id === friend.id && <Ionicons name="checkmark" size={20} color={theme.primary} style={{ marginLeft: 'auto' }} />}
                                    </TouchableOpacity>
                                ))
                            )}
                        </ScrollView>
                    </View>
                )}

                {/* --- SELECTION FILM (Navigation vers MovieList) --- */}
                <Text style={[styles.label, { color: theme.subText }]}>Quel film ?</Text>
                <TouchableOpacity 
                    style={[styles.input, styles.dropdownTrigger, { backgroundColor: theme.card, borderColor: theme.border }]}
                    onPress={openMovieSelector}
                    activeOpacity={0.7}
                >
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Ionicons name="film-outline" size={20} color={selectedMovie ? theme.primary : theme.subText} style={{ marginRight: 10 }} />
                        <Text style={{ color: selectedMovie ? theme.text : theme.subText, fontSize: 16 }}>
                            {selectedMovie ? selectedMovie.title : "Sélectionner un film"}
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={theme.subText} />
                </TouchableOpacity>

                <Text style={[styles.label, { color: theme.subText }]}>Pourquoi ?</Text>
                <TextInput
                    style={[styles.input, styles.multilineInput, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
                    placeholder="Pourquoi ce film ?"
                    placeholderTextColor={theme.subText}
                    value={explanation}
                    onChangeText={setExplanation}
                    multiline={true}
                    numberOfLines={4}
                />
                
                <Text style={[styles.typeLabel, { color: theme.text }]}>Votre réaction</Text>
                <View style={styles.emojiGrid}>
                    {EMOJI_OPTIONS.map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.emojiCard,
                                { backgroundColor: theme.card },
                                selectedEmoji === option.value && [styles.emojiCardSelected, { borderColor: theme.primary, backgroundColor: theme.dark ? '#333' : '#F0F7F9' }]
                            ]}
                            onPress={() => setSelectedEmoji(option.value)}
                        >
                            <Text style={styles.emojiIcon}>{option.icon}</Text>
                            <Text 
                                style={[
                                    styles.emojiName, 
                                    { color: theme.subText },
                                    selectedEmoji === option.value && [styles.emojiNameSelected, { color: theme.primary }]
                                ]}
                                numberOfLines={1} 
                                adjustsFontSizeToFit
                            >
                                {option.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity 
                    style={[styles.primaryButton, { backgroundColor: theme.primary }]} 
                    onPress={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.primaryButtonText}>
                            {isEditMode ? "Enregistrer les modifications" : "Partager"}
                        </Text>
                    )}
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1 },
    headerTitle: { fontSize: 20, fontWeight: 'bold' },
    content: { padding: 25, paddingBottom: 50 },
    label: { fontSize: 14, fontWeight: '600', marginBottom: 5, marginLeft: 2 },
    input: { borderWidth: 1, marginBottom: 15, borderRadius: 8, height: 50, paddingHorizontal: 15, fontSize: 16, justifyContent: 'center' },
    dropdownTrigger: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    dropdownList: { borderWidth: 1, borderTopWidth: 1, borderBottomLeftRadius: 8, borderBottomRightRadius: 8, marginBottom: 15, overflow: 'hidden' },
    dropdownItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1 },
    avatarContainerSmall: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 10, overflow: 'hidden' },
    profileImageSmall: { width: '100%', height: '100%', borderRadius: 15 },
    dropdownItemText: { fontSize: 16, flex: 1 },
    multilineInput: { height: 120, paddingTop: 15, textAlignVertical: 'top' },
    typeLabel: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
    emojiGrid: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', marginBottom: 30 },
    emojiCard: { width: '18%', aspectRatio: 1, borderRadius: 12, paddingVertical: 4, justifyContent: 'center', alignItems: 'center', marginBottom: 10, borderWidth: 2, borderColor: 'transparent', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
    emojiCardSelected: { borderWidth: 2 },
    emojiIcon: { fontSize: 30, textAlign: 'center', marginBottom: 2, includeFontPadding: false },
    emojiName: { fontSize: 8, textAlign: 'center', paddingHorizontal: 2, fontWeight: '500' },
    emojiNameSelected: { fontWeight: 'bold' },
    primaryButton: { padding: 15, borderRadius: 25, alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 3 },
    primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});