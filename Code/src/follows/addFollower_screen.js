import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { executeQuery } from '../services/api'; 
import { useAuth } from '../context/authContext'; 

const PRIMARY_COLOR = '#4A6572';
const TEXT_COLOR = '#333';
const SUBTLE_COLOR = '#999';

function UserSearchResultItem({ user }) {
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
    const { user } = useAuth(); 
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (!user) return;

            try {
                const friendsRes = await executeQuery('get_my_friends', { user_id: user.id });
                const followingIds = friendsRes.success ? friendsRes.data.map(f => f.id) : [];

                const usersRes = await executeQuery('search_users', { query: '' }); 

                if (usersRes.success) {
                    const formattedUsers = usersRes.data
                        .filter(u => u.id !== user.id) 
                        .map(u => ({
                            id: u.id,
                            name: u.username, 
                            isFollowing: followingIds.includes(u.id)
                        }));
                    
                    setSearchResults(formattedUsers);
                }
            } catch (e) {
                console.error("Erreur chargement utilisateurs:", e);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [user]);

    const filteredResults = searchResults.filter(u =>
        u.name.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>

                {/* btn retour */}    
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={PRIMARY_COLOR} />
                </TouchableOpacity>
                
                <View style={{flexDirection:'row', alignItems:'center', marginBottom:20, justifyContent:'center'}}>
                     <Text style={[styles.sectionTitle, {marginBottom:0}]}>Ajouter des Amis</Text>
                </View>
                
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

                {loading ? (
                    <ActivityIndicator size="large" color={PRIMARY_COLOR} style={{marginTop: 50}} />
                ) : (
                    <FlatList
                        data={filteredResults}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => (
                            <UserSearchResultItem user={item} />
                        )}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>Aucun utilisateur trouvé.</Text>
                        }
                    />
                )}
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