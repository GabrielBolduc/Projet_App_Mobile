import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { executeQuery } from '../services/api'; 
import { useAuth } from '../context/authContext'; 

const PRIMARY_COLOR = '#4A6572';

function UserSearchResultItem({ user, onToggleFollow, theme }) {
    
    const buttonProps = {
        icon: "person-add",
        color: '#28A745',
        onPress: () => onToggleFollow(user.id, true) 
    };

    if (user.isFollowing) {
         buttonProps.icon = "checkmark-circle";
         buttonProps.color = theme.primary;
         buttonProps.onPress = () => {}; 
    }

    return (
        <View style={[styles.card, { backgroundColor: theme.card }]}>
            <View style={styles.userInfo}>
                <View style={[styles.avatarContainer, { backgroundColor: theme.primary }]}>
                    {user.photo_profile ? (
                        <Image 
                            source={{ uri: user.photo_profile }} 
                            style={styles.profileImage}
                        />
                    ) : (
                        <Ionicons name="person" size={24} color="#fff" />
                    )}
                </View>
                <Text style={[styles.userName, { color: theme.text }]}>{user.name}</Text>
            </View>
            
            <TouchableOpacity 
                style={styles.actionButton} 
                onPress={buttonProps.onPress}
            >
                <Ionicons 
                    name={buttonProps.icon} 
                    size={28} 
                    color={buttonProps.color}
                />
            </TouchableOpacity>
        </View>
    );
}

export default function AddFollower({ navigation }) {
    const { user, theme } = useAuth(); // Récupération du thème
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]); 
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        if (!user) return;

        try {
            const friendsRes = await executeQuery('get_my_friends', { user_id: user.id });
            const followingIds = friendsRes.success ? friendsRes.data.map(f => f.id) : []; 

            const usersRes = await executeQuery('search_users', { query: '' }); 

            if (usersRes.success) {
                const formattedUsers = usersRes.data
                    .filter(u => u.id !== user.id)
                    .filter(u => !followingIds.includes(u.id)) 
                    .map(u => ({
                        id: u.id,
                        name: u.username, 
                        photo_profile: u.photo_profile,
                        isFollowing: false
                    }));
                
                setSearchResults(formattedUsers);
            }
        } catch (e) {
            console.error("Erreur chargement utilisateurs:", e);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        loadData();
    }, [user]);
    
    const handleFollowToggle = async (followedId, shouldFollow) => {
        if (!user) return;
        if (!shouldFollow) return;
        
        setLoading(true); 

        try {
            const result = await executeQuery('follow_user', {
                follower_id: user.id,
                followed_id: followedId
            });

            if (result.success) {
                await loadData(); 
            } else {
                console.error("Erreur follow:", result.error);
                Alert.alert("Erreur", "Impossible de suivre cet utilisateur.");
                setLoading(false);
            }
        } catch (e) {
            console.error("Erreur réseau follow:", e);
            Alert.alert("Erreur", "Problème de connexion.");
            setLoading(false);
        } 
    };

    const filteredResults = searchResults.filter(u =>
        u.name.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.content}>

                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.primary} />
                </TouchableOpacity>
                
                <View style={{flexDirection:'row', alignItems:'center', marginBottom:20, justifyContent:'center'}}>
                     <Text style={[styles.sectionTitle, { color: theme.primary, marginBottom:0 }]}>Ajouter des Amis</Text>
                </View>
                
                {/* Barre de recherche */}
                <View style={[styles.searchBar, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <Ionicons name="search" size={20} color={theme.subText} style={{ marginRight: 10 }} />
                    <TextInput
                        style={[styles.searchInput, { color: theme.text }]}
                        placeholder="Rechercher par nom d'utilisateur..."
                        placeholderTextColor={theme.subText}
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color={theme.primary} style={{marginTop: 50}} />
                ) : (
                    <FlatList
                        data={filteredResults}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => (
                            <UserSearchResultItem 
                                user={item} 
                                onToggleFollow={handleFollowToggle}
                                theme={theme} 
                            />
                        )}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={
                            <Text style={[styles.emptyText, { color: theme.subText }]}>Aucun utilisateur trouvé.</Text>
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
    },
    content: {
        flex: 1,
        padding: 20,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        marginBottom: 20,
        borderRadius: 8,
        height: 50,
        paddingHorizontal: 15,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
    },
    listContent: {
        paddingBottom: 20,
    },
    card: {
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
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        overflow: 'hidden',
    },
    profileImage: {
        width: '100%', 
        height: '100%', 
        borderRadius: 20,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
    },
    actionButton: {
        padding: 5,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
    }
});