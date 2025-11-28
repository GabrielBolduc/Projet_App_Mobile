import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native'; 
import Ionicons from '@expo/vector-icons/Ionicons';
import { executeQuery } from '../services/api'; 
import { useAuth } from '../context/AuthContext'; 

const PRIMARY_COLOR = '#4A6572';

export default function Follow({ navigation }) {
  const { user } = useAuth(); 
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

  const renderItem = ({ item }) => (
    <View style={styles.card}>
        <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
                <Text style={{color:'#fff', fontWeight:'bold', fontSize:18}}>
                    {item.username ? item.username.charAt(0).toUpperCase() : '?'}
                </Text>
            </View>
            <Text style={styles.title}>{item.username}</Text>
        </View>
        
        <TouchableOpacity 
            onPress={() => {}} 
        >
            <Ionicons name="close-circle-outline" size={28} color="#D32F2F" />
        </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>

        <View style={styles.headerContainer}>
           <Text style={styles.screenTitle}>My follow</Text>
        </View>
        
        {loading ? (
            <ActivityIndicator size="large" color={PRIMARY_COLOR} style={{marginTop: 50}} />
        ) : (
            <FlatList
                data={friends}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={{alignItems:'center', marginTop: 50}}>
                        <Text style={{color:'#888'}}>Vous ne suivez personne pour l'instant.</Text>
                    </View>
                }
            />
        )}

        <TouchableOpacity 
            style={styles.fab} 
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
    listContent: {
        padding: 20,
        paddingBottom: 80,
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
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: PRIMARY_COLOR,
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