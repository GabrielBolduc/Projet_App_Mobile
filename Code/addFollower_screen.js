import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

const PRIMARY_COLOR = '#4A6572';
const TEXT_COLOR = '#333';
const SUBTLE_COLOR = '#999';

// Mock Data (Liste des utilisateurs potentiels à ajouter)
const USERS_TO_ADD = [
    { id: 'u1', name: 'Leo_D', isFollowing: false },
    { id: 'u2', name: 'Jane_Doe', isFollowing: true },
    { id: 'u3', name: 'ChrisNolanFan', isFollowing: false },
    { id: 'u4', name: 'Sophie_L', isFollowing: false },
    { id: 'u5', name: 'MovieBuff123', isFollowing: true },
    { id: 'u6', name: 'CinemaLover', isFollowing: false },
    { id: 'u7', name: 'FilmGeek', isFollowing: false },
    { id: 'u8', name: 'Anna_K', isFollowing: true },
    { id: 'u9', name: 'John_Smith', isFollowing: false },
    { id: 'u10', name: 'PopcornAddict', isFollowing: false },
];

function UserSearchResultItem({ user, onToggleFollow }) {
    return (
        <View style={styles.card}>
            <View style={styles.userInfo}>
                <View style={styles.avatarContainer}>
                    <Ionicons name="person" size={24} color="#fff" />
                </View>
                <Text style={styles.userName}>{user.name}</Text>
            </View>
            
            <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => onToggleFollow(user.id)}
            >
                <Ionicons 
                    name={user.isFollowing ? "checkmark-circle" : "person-add"} 
                    size={28} 
                    color={user.isFollowing ? PRIMARY_COLOR : '#28A745'}
                />
            </TouchableOpacity>
        </View>
    );
}

export default function AddFollower({ navigation }) {
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState(USERS_TO_ADD);

    const handleToggleFollow = (userId) => {
        setSearchResults(prevResults =>
            prevResults.map(user =>
                user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user
            )
        );
    };

    const filteredResults = searchResults.filter(user =>
        user.name.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                
                <Text style={styles.sectionTitle}>Ajouter des Amis</Text>
                
                {/* Champ de recherche */}
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color={SUBTLE_COLOR} style={{ marginRight: 10 }} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Rechercher par nom d'utilisateur..."
                        placeholderTextColor={SUBTLE_COLOR}
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </View>

                {/* Liste des résultats */}
                <FlatList
                    data={filteredResults}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <UserSearchResultItem 
                            user={item} 
                            onToggleFollow={handleToggleFollow} 
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>Aucun utilisateur trouvé.</Text>
                    }
                />
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
        padding: 20,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: PRIMARY_COLOR,
        marginBottom: 20,
        textAlign: 'center',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderColor: '#E0E0E0',
        borderWidth: 1,
        marginBottom: 20,
        borderRadius: 8,
        height: 50,
        paddingHorizontal: 15,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: TEXT_COLOR,
    },
    listContent: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: PRIMARY_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: TEXT_COLOR,
    },
    actionButton: {
        padding: 5,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        color: SUBTLE_COLOR,
        fontSize: 16,
    }
});