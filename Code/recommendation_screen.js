import React, { useState, useCallback } from "react";
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native'; 
import { executeQuery } from './services/api'; 
import { useAuth } from './context/AuthContext'; 

const PRIMARY_COLOR = '#4A6572';

const RecommendationItem = ({ item }) => (
    <View style={styles.card}>
        <View style={styles.cardHeader}>
            <Ionicons name="person-circle" size={34} color={PRIMARY_COLOR} style={{ marginRight: 8 }} />
            <Text style={styles.headerText}>
                <Text style={styles.username}>{item.sender_name}</Text> vous recommande :
            </Text>
        </View>

        <View style={styles.movieContainer}>
            <Ionicons name="film-outline" size={20} color="#666" style={{ marginRight: 8 }} />
            <Text style={styles.movieTitle}>{item.movie_title}</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.labelText}>Raison :</Text>
        <Text style={styles.reasonText}>{item.message}</Text>

        <View style={styles.reactionContainer}>
            <Text style={styles.labelText}>Réaction :</Text>
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
                    <Ionicons name="add" size={30} color="#fff" />
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
        padding: 20,
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
        marginBottom: 10,
    },
    headerText: {
        fontSize: 16,
        color: '#555',
    },
    username: {
        fontWeight: 'bold',
        color: PRIMARY_COLOR,
    },
    movieContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    movieTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    divider: {
        height: 2,
        backgroundColor: '#F0F0F0',
        marginVertical: 10,
    },
    labelText: {
        fontSize: 14,
        color: '#888',
        fontStyle: 'italic',
        marginBottom: 4,
    },
    reasonText: {
        fontSize: 16,
        color: '#444',
        marginBottom: 15,
        lineHeight: 22,
    },
    reactionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
        padding: 8,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    reactionEmoji: {
        fontSize: 24,
        marginLeft: 10,
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