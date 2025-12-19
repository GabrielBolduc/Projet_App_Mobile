import React, { useState, useCallback } from "react";
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, Image } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native'; 
import { executeQuery } from '../services/api'; 
import { useAuth } from '../context/authContext'; 

const RecommendationItem = ({ item }) => {
    const { theme } = useAuth();

    return (
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            
            <View style={styles.headerRow}>
                <View style={[styles.avatarContainer, { backgroundColor: theme.primary }]}>
                    {item.photo_profile ? (
                        <Image 
                            source={{ uri: item.photo_profile }} 
                            style={styles.profileImage}
                        />
                    ) : (
                        <Text style={styles.initialsText}>
                            {item.sender_name ? item.sender_name.charAt(0).toUpperCase() : '?'}
                        </Text>
                    )}
                </View>

                <View style={styles.headerTextContainer}>
                    <Text style={[styles.senderText, { color: theme.subText }]} numberOfLines={1}>
                        Recommandé par <Text style={[styles.username, { color: theme.primary }]}>{item.sender_name}</Text>
                    </Text>
                    <Text style={[styles.movieTitle, { color: theme.text }]} numberOfLines={2}>
                        {item.movie_title}
                    </Text>
                </View>

                <View style={[styles.emojiContainer, { backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                    <Text style={styles.emojiText}>{item.emoji}</Text>
                </View>
            </View>

            <View style={[styles.separator, { backgroundColor: theme.border }]} />

            <View style={styles.messageContainer}>
                <Text style={[styles.messageText, { color: theme.text }]}>
                    "{item.message}"
                </Text>
            </View>

        </View>
    );
};

export default function Recommendation({ navigation }) {
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
                    <Text style={[styles.screenTitle, { color: theme.primary }]}>Recommandations</Text>
                    <Text style={[styles.subtitle, { color: theme.subText }]}>
                        {recommendations.length} recommandation{recommendations.length !== 1 ? 's' : ''}
                    </Text>
                </View>
                
                {loading && !refreshing ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={theme.primary} />
                        <Text style={[styles.loadingText, { color: theme.subText, marginTop: 10 }]}>
                            Chargement des recommandations...
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={recommendations}
                        renderItem={({ item }) => <RecommendationItem item={item} />}
                        keyExtractor={item => item.id.toString()}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl 
                                refreshing={refreshing} 
                                onRefresh={onRefresh} 
                                colors={[theme.primary]} 
                                tintColor={theme.primary}
                                title="Tirer pour rafraîchir"
                                titleColor={theme.subText}
                            />
                        }
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Ionicons name="film-outline" size={60} color={theme.subText} style={{ opacity: 0.5 }}/>
                                <Text style={[styles.emptyTitle, { color: theme.text, marginTop: 15 }]}>
                                    Aucune recommandation
                                </Text>
                                <Text style={[styles.emptyText, { color: theme.subText, marginTop: 5 }]}>
                                    Vos amis n'ont pas encore partagé de recommandations avec vous
                                </Text>
                                <TouchableOpacity 
                                    style={[styles.emptyButton, { backgroundColor: theme.primary, marginTop: 20 }]}
                                    onPress={() => navigation.navigate('AddRecommendation')}
                                >
                                    <Text style={styles.emptyButtonText}>Partager une recommandation</Text>
                                </TouchableOpacity>
                            </View>
                        }
                    />
                )}

                <TouchableOpacity 
                    style={[styles.fab, { backgroundColor: theme.primary }]} 
                    onPress={() => navigation.navigate('AddRecommendation')}
                    activeOpacity={0.8}
                >
                    <Ionicons name="add" size={28} color="#fff" />
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
    subtitle: {
        fontSize: 14,
        marginTop: 2,
        opacity: 0.8,
    },
    listContent: {
        padding: 16,
        paddingBottom: 90,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 14,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
        paddingTop: 60,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
    emptyText: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        opacity: 0.7,
    },
    emptyButton: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
    },
    emptyButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
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
        elevation: 6,
        shadowColor: "#000", 
        shadowOffset: { width: 0, height: 3 }, 
        shadowOpacity: 0.2, 
        shadowRadius: 4,
    },
    card: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    avatarContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        marginRight: 12,
    },
    profileImage: {
        width: '100%',
        height: '100%',
    },
    initialsText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    headerTextContainer: {
        flex: 1,
        justifyContent: 'center',
        marginRight: 8,
    },
    senderText: {
        fontSize: 13,
        marginBottom: 4,
        opacity: 0.8,
    },
    username: {
        fontWeight: '700',
    },
    movieTitle: {
        fontSize: 18,
        fontWeight: '700',
        lineHeight: 24,
    },
    emojiContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    emojiText: {
        fontSize: 20,
    },
    separator: {
        height: 1,
        marginVertical: 14,
        opacity: 0.3,
    },
    messageContainer: {
        paddingHorizontal: 4,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 22,
        fontStyle: 'italic',
        opacity: 0.9,
    },
});