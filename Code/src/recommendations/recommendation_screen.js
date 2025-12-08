import React, { useState, useCallback } from "react";
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, Image } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native'; 
import { executeQuery } from '../services/api'; 
import { useAuth } from '../context/authContext'; 

const PRIMARY_COLOR = '#4A6572';

const RecommendationItem = ({ item }) => (
    <View style={styles.card}>
        
        <View style={styles.cardHeader}>
            
            <View style={styles.avatarContainer}>
                {item.photo_profile ? (
                    <Image 
                        source={{ uri: item.photo_profile }} 
                        style={styles.profileImage}
                    />
                ) : (
                    <View style={styles.initialsContainer}>
                        <Text style={styles.initialsText}>
                            {item.sender_name ? item.sender_name.charAt(0).toUpperCase() : '?'}
                        </Text>
                    </View>
                )}
            </View>
            
            <View style={styles.headerContent}>
                <Text style={styles.senderIntroText}>
                    <Text style={styles.username}>{item.sender_name}</Text> recommande :
                </Text>
                <Text style={styles.movieTitle} numberOfLines={1}>{item.movie_title}</Text>
            </View>
        </View>
        
        <View style={styles.divider} />

        <View style={styles.messageContainer}>
             <Text style={styles.reasonLabel}>Pourquoi ce film :</Text>
            <Text style={styles.reasonText}>{item.message}</Text>
        </View>
        
        <View style={styles.reactionPill}>
            <Text style={styles.reactionLabel}>Réaction :</Text>
            <Text style={styles.reactionEmoji}>{item.emoji}</Text>
        </View>
    </View>
);

export default function Recommendation({ navigation }) {
    const { user } = useAuth(); 
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchRecommendations = async () => {
        if (!user) return;

        try {
            // appel api
            const result = await executeQuery('get_my_recommendations', { user_id: user.id });
            
            if (result.success) {
                setRecommendations(result.data);
            }
        } catch (e) {
            console.error("Erreur chargement recommandations:", e);
        } finally {
            setLoading(false);
        }
    };

    // reload pour voir nouvelle
    useFocusEffect(
        useCallback(() => {
            fetchRecommendations();
        }, [user])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchRecommendations();
        setRefreshing(false);
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>

                <View style={styles.headerContainer}>
                    <Text style={styles.screenTitle}>Recommandation</Text>
                </View>
                
                {loading && !refreshing ? (
                    <ActivityIndicator size="large" color={PRIMARY_COLOR} style={{marginTop: 50}} />
                ) : (
                    <FlatList
                        data={recommendations}
                        renderItem={({ item }) => <RecommendationItem item={item} />}
                        keyExtractor={item => item.id.toString()}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[PRIMARY_COLOR]} />
                        }
                        ListEmptyComponent={
                            <View style={{alignItems:'center', marginTop: 50}}>
                                <Text style={{color:'#888'}}>Aucune recommandation reçue pour le moment.</Text>
                            </View>
                        }
                    />
                )}

                <TouchableOpacity 
                    style={styles.fab} 
                    onPress={() => navigation.navigate('AddRecommendation')}
                >
                    <Ionicons name="add" size={32} color="#fff" />
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
        borderRadius: 16,
        padding: 15, 
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 15,
    },
    headerContent: {
        flex: 1,
        marginLeft: 10,
    },
    senderIntroText: {
        fontSize: 14,
        color: '#666',
    },
    username: {
        fontWeight: 'bold',
        color: PRIMARY_COLOR,
    },
    avatarContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: PRIMARY_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        flexShrink: 0,
    },
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
    },
    initialsContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    initialsText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    movieTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 2,
    },
    messageContainer: {
        paddingVertical: 10,
    },
    reasonLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#888',
        marginBottom: 4,
    },
    reasonText: {
        fontSize: 16,
        color: '#444',
        lineHeight: 22,
    },
    divider: {
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    reactionPill: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F0F7F9',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginTop: 10,
    },
    reactionLabel: {
        fontSize: 14,
        color: PRIMARY_COLOR,
        fontWeight: '600',
    },
    reactionEmoji: {
        fontSize: 24,
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