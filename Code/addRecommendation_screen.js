import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

const PRIMARY_COLOR = '#4A6572';
const TEXT_COLOR = '#333';
const SUBTLE_COLOR = '#999';

// Données simulées
const MOCK_FRIENDS = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Alice Johnson' },
    { id: '4', name: 'Bob Brown' },
    { id: '5', name: 'Charlie Davis' },
    { id: '6', name: 'Diana Evans' },
    { id: '7', name: 'Frank Green' },
    { id: '8', name: 'Grace Harris' },
    { id: '9', name: 'Henry Lee' },
    { id: '10', name: 'Ivy Martinez' },
];

const EMOJI_OPTIONS = [
    { value: 'happy', icon: '😁', name: 'Génial' },
    { value: 'sad', icon: '😔', name: 'Déçu' },
    { value: 'shock', icon: '🤯', name: 'Surpris' },
    { value: 'love', icon: '😍', name: 'J’adore' },
];

export default function AddRecommendationScreen({ navigation }) {
    const [movieName, setMovieName] = useState('');
    const [explanation, setExplanation] = useState('');
    
    // États pour les sélections
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [selectedEmoji, setSelectedEmoji] = useState(null);
    
    // État pour ouvrir/fermer le menu déroulant
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleShare = () => {
        if (!movieName || !explanation || !selectedFriend || !selectedEmoji) {
            alert("Veuillez remplir tous les champs !");
            return;
        }
        console.log({ 
            movie: movieName, 
            reason: explanation, 
            friend_id: selectedFriend.id, 
            emoji: selectedEmoji 
        });
        alert("Recommandation partagée !");
        navigation.goBack();
    };

    const handleSelectFriend = (friend) => {
        setSelectedFriend(friend);
        setIsDropdownOpen(false);
    };

    return (
        <SafeAreaView style={styles.container}>

            <ScrollView contentContainerStyle={styles.content}>
                
                <Text style={styles.sectionTitle}>Ajouter une Recommandation</Text>

                <TouchableOpacity 
                    style={[styles.input, styles.dropdownTrigger, isDropdownOpen && styles.dropdownTriggerOpen]}
                    onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                    activeOpacity={0.7}
                >
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Ionicons 
                            name="person-outline" 
                            size={20} 
                            color={selectedFriend ? PRIMARY_COLOR : SUBTLE_COLOR} 
                            style={{ marginRight: 10 }} 
                        />
                        <Text style={{ color: selectedFriend ? TEXT_COLOR : SUBTLE_COLOR, fontSize: 16 }}>
                            {selectedFriend ? selectedFriend.name : "Sélectionner un ami"}
                        </Text>
                    </View>
                    
                    <Ionicons 
                        name={isDropdownOpen ? "chevron-up" : "chevron-down"} 
                        size={20} 
                        color={SUBTLE_COLOR} 
                    />
                </TouchableOpacity>

                {isDropdownOpen && (
                    <View style={styles.dropdownList}>
                        <ScrollView nestedScrollEnabled={true} style={{ maxHeight: 200 }}>
                            {MOCK_FRIENDS.map((friend) => (
                                <TouchableOpacity 
                                    key={friend.id} 
                                    style={styles.dropdownItem}
                                    onPress={() => handleSelectFriend(friend)}
                                >
                                    <Ionicons name="person-circle" size={30} color={PRIMARY_COLOR} style={{ marginRight: 10 }} />
                                    <Text style={styles.dropdownItemText}>{friend.name}</Text>
                                    
                                    {selectedFriend?.id === friend.id && (
                                        <Ionicons name="checkmark" size={20} color={PRIMARY_COLOR} style={{ marginLeft: 'auto' }} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

                <TextInput
                    style={styles.input}
                    placeholder="Nom du film"
                    placeholderTextColor={SUBTLE_COLOR}
                    value={movieName}
                    onChangeText={setMovieName}
                />

                <TextInput
                    style={[styles.input, styles.multilineInput]}
                    placeholder="Pourquoi ce film ?"
                    placeholderTextColor={SUBTLE_COLOR}
                    value={explanation}
                    onChangeText={setExplanation}
                    multiline={true}
                    numberOfLines={4}
                />
                
                <Text style={styles.typeLabel}>Votre réaction</Text>
                <View style={styles.emojiContainer}>
                    {EMOJI_OPTIONS.map((option) => (
                        <TouchableOpacity
                            key={option.value}
                            style={[
                                styles.emojiButton,
                                selectedEmoji === option.value && styles.emojiButtonSelected
                            ]}
                            onPress={() => setSelectedEmoji(option.value)}
                        >
                            <Text style={styles.emojiText}>{option.icon}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity style={styles.primaryButton} onPress={handleShare}>
                    <Text style={styles.primaryButtonText}>Partager</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    content: {
        padding: 25,
        paddingBottom: 50,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: PRIMARY_COLOR,
        marginBottom: 25,
        textAlign: 'center',
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
        color: TEXT_COLOR,
        justifyContent: 'center', 
    },
    // Styles spécifiques au Dropdown
    dropdownTrigger: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dropdownTriggerOpen: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderBottomWidth: 0,
        marginBottom: 0,
    },
    dropdownList: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderTopWidth: 1,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        marginBottom: 15,
        overflow: 'hidden',
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        backgroundColor: '#fff',
    },
    dropdownItemText: {
        fontSize: 16,
        color: TEXT_COLOR,
    },
    multilineInput: {
        height: 120, 
        paddingTop: 15,
        textAlignVertical: 'top',
    },
    typeLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: TEXT_COLOR,
        marginBottom: 10,
    },
    emojiContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    emojiButton: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#EAEAEA',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    emojiButtonSelected: {
        borderColor: PRIMARY_COLOR,
        backgroundColor: '#e6f0f4',
    },
    emojiText: {
        fontSize: 32,
    },
    primaryButton: {
        backgroundColor: PRIMARY_COLOR,
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
        shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 3,
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});