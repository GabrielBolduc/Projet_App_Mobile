import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator, Image, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native'; 
import Ionicons from '@expo/vector-icons/Ionicons';
import { executeQuery } from '../services/api'; 
import { useAuth } from '../context/authContext'; 

// On garde PRIMARY_COLOR s'il ne change pas, sinon on peut utiliser theme.primary
const PRIMARY_COLOR = '#4A6572';

export default function Follow({ navigation }) {
  // 1. Récupération du thème
  const { user, theme } = useAuth(); 
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFriends = async () => {
    if (!user) return;

    try {
        const result = await executeQuery('get_my_friends', { user_id: user.id });
        if (result.success) {
            setFriends(result.data);
        }
    } catch (e) {
        console.error("Erreur chargement amis:", e);
    } finally {
        setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFriends();
    }, [user])
  );

  const handleUnfollow = (friendId, friendName) => {
    Alert.alert(
      "Ne plus suivre",
      `Voulez-vous vraiment retirer ${friendName} de vos amis ?`,
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Retirer", 
          style: "destructive", 
          onPress: async () => {
            setLoading(true);
            try {
                const result = await executeQuery('unfollow_user', {
                    follower_id: user.id,
                    followed_id: friendId
                });
                
                if (result.success) {
                    fetchFriends(); 
                } else {
                    Alert.alert("Erreur", "Impossible de supprimer cet ami.");
                    setLoading(false);
                }
            } catch (e) {
                console.error(e);
                setLoading(false);
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    // 2. Application de la couleur de carte dynamique
    <View style={[styles.card, { backgroundColor: theme.card }]}>
        <View style={styles.userInfo}>
            <View style={[styles.avatarContainer, { backgroundColor: theme.primary }]}>
                {item.photo_profile ? (
                    <Image 
                        source={{ uri: item.photo_profile }} 
                        style={styles.profileImage}
                    />
                ) : (
                    <Text style={{color:'#fff', fontWeight:'bold', fontSize:18}}>
                        {item.username ? item.username.charAt(0).toUpperCase() : '?'}
                    </Text>
                )}
            </View>
            
            <Text style={[styles.title, { color: theme.text }]}>{item.username}</Text>
        </View>
        
        <TouchableOpacity 
            onPress={() => handleUnfollow(item.id, item.username)} 
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        >
            <Ionicons name="close-circle-outline" size={28} color={theme.danger} />
        </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaProvider>
      {/* fond d'ecran dynamique */}
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>

        <View style={[styles.headerContainer, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
           <Text style={[styles.screenTitle, { color: theme.primary }]}>Mes follow</Text>
        </View>
        
        {loading ? (
            <ActivityIndicator size="large" color={theme.primary} style={{marginTop: 50}} />
        ) : (
            <FlatList
                data={friends}
                keyExtractor={item => item.id.toString()} 
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={{alignItems:'center', marginTop: 50}}>
                        <Text style={{color: theme.subText}}>Vous ne suivez personne pour l'instant.</Text>
                    </View>
                }
            />
        )}

        <TouchableOpacity 
            style={[styles.fab, { backgroundColor: theme.primary }]} 
            onPress={() => navigation.navigate('AddFollower')}
        >
            <Ionicons name="person-add" size={24} color="#fff" />
        </TouchableOpacity>

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
   },
    listContent: {
        padding: 20,
        paddingBottom: 80,
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
    title: {
        fontSize: 16,
        fontWeight: '600',
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
});