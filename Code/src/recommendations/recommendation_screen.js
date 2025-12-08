import React, { useState, useCallback } from "react";
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, Image } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native'; 
import { executeQuery } from '../services/api'; 
import { useAuth } from '../context/authContext'; 

const RecommendationItem = ({ item }) => {
    // 1. Récupération du thème dans l'item
    const { theme } = useAuth();

    return (
        <View style={[styles.card, { backgroundColor: theme.card }]}>
            
            <View style={styles.cardHeader}>
                
                <View style={[styles.avatarContainer, { backgroundColor: theme.primary }]}>
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
                    <Text style={[styles.senderIntroText, { color: theme.subText }]}>
                        <Text style={[styles.username, { color: theme.primary }]}>{item.sender_name}</Text> recommande :
                    </Text>
                    <Text style={[styles.movieTitle, { color: theme.text }]} numberOfLines={1}>{item.movie_title}</Text>
                </View>
            </View>
            
            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <View style={styles.messageContainer}>
                 <Text style={[styles.reasonLabel, { color: theme.subText }]}>Pourquoi ce film :</Text>
                <Text style={[styles.reasonText, { color: theme.text }]}>{item.message}</Text>
            </View>
            
            <View style={[styles.reactionPill, { backgroundColor: theme.dark ? '#333' : '#F0F7F9' }]}>
                <Text style={[styles.reactionLabel, { color: theme.primary }]}>Réaction :</Text>
                <Text style={styles.reactionEmoji}>{item.emoji}</Text>
            </View>
        </View>
    );
};

export default function Recommendation({ navigation }) {
    // 2. Récupération du thème dans l'écran principal
    const { user, theme } = useAuth(); 
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchRecommendations = async () => {
        if (!user) return;

        try {
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
            <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>

                <View style={[styles.headerContainer, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
                    <Text style={[styles.screenTitle, { color: theme.primary }]}>Recommandation</Text>
                </View>
                
                {loading && !refreshing ? (
                    <ActivityIndicator size="large" color={theme.primary} style={{marginTop: 50}} />
                ) : (
                    <FlatList
                        data={recommendations}
                        renderItem={({ item }) => <RecommendationItem item={item} />}
                        keyExtractor={item => item.id.toString()}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} tintColor={theme.primary} />
                        }
                        ListEmptyComponent={
                            <View style={{alignItems:'center', marginTop: 50}}>
                                <Text style={{color: theme.subText}}>Aucune recommandation reçue pour le moment.</Text>
                            </View>
                        }
                    />
                )}

                <TouchableOpacity 
                    style={[styles.fab, { backgroundColor: theme.primary }]} 
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
        // background géré dynamiquement
    },
    headerContainer: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        // colors gérées dynamiquement
    },
    screenTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        // color gérée dynamiquement
    },
    listContent: {
        padding: 20,
        paddingBottom: 80,
    },
    card: {
        borderRadius: 16,
        padding: 15, 
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        // bg géré dynamiquement
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
        // color gérée dynamiquement
    },
    username: {
        fontWeight: 'bold',
        // color gérée dynamiquement
    },
    avatarContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        flexShrink: 0,
        // bg géré dynamiquement
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
        marginTop: 2,
        // color gérée dynamiquement
    },
    messageContainer: {
        paddingVertical: 10,
    },
    reasonLabel: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 4,
        // color gérée dynamiquement
    },
    reasonText: {
        fontSize: 16,
        lineHeight: 22,
        // color gérée dynamiquement
    },
    divider: {
        height: 1,
        // bg géré dynamiquement
    },
    reactionPill: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginTop: 10,
        // bg géré dynamiquement
    },
    reactionLabel: {
        fontSize: 14,
        fontWeight: '600',
        // color gérée dynamiquement
    },
    reactionEmoji: {
        fontSize: 24,
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
        // bg géré dynamiquement
    },
});