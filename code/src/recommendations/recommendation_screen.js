import React, { useState, useCallback } from "react";
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, Image, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native'; 
import { executeQuery } from '../services/api'; 
import { useAuth } from '../context/authContext';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';


// ITEM REÇU
const ReceivedItem = ({ item, theme }) => (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.headerRow}>
            <View style={[styles.avatarContainer, { backgroundColor: theme.primary }]}>
                {item.photo_profile ? (
                    <Image source={{ uri: item.photo_profile }} style={styles.profileImage} />
                ) : (
                    <Text style={styles.initialsText}>
                        {item.sender_name ? item.sender_name.charAt(0).toUpperCase() : '?'}
                    </Text>
                )}
            </View>
            <View style={styles.headerTextContainer}>
                <Text style={[styles.senderText, { color: theme.subText }]} numberOfLines={1}>
                    <Text style={[styles.username, { color: theme.primary }]}>{item.sender_name}</Text>
                    <Text> recommande :</Text>
                </Text>
                <Text style={[styles.movieTitle, { color: theme.text }]} numberOfLines={1}>
                    {item.movie_title}
                </Text>
            </View>
        </View>

        <View style={[styles.contentRow, { backgroundColor: theme.dark ? 'rgba(255,255,255,0.05)' : '#F5F5F5' }]}>
            <Text style={[styles.messageText, { color: theme.text }]}>{item.message}</Text>
            <View style={[styles.miniReactionBadge, { borderColor: theme.border, backgroundColor: theme.card }]}>
                <Text style={styles.reactionEmoji}>{item.emoji}</Text>
            </View>
        </View>
    </View>
);

// ITEM ENVOYÉ
const SentItem = ({ item, theme, onDelete, onEdit }) => (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.headerRow}>
            <View style={styles.headerTextContainer}>
                <Text style={[styles.senderText, { color: theme.subText }]} numberOfLines={1}>
                    Pour <Text style={[styles.username, { color: theme.primary }]}>{item.receiver_name}</Text> :
                </Text>
                <Text style={[styles.movieTitle, { color: theme.text }]} numberOfLines={1}>
                    {item.movie_title}
                </Text>
            </View>
            <TouchableOpacity onPress={() => onDelete(item)} style={{ padding: 5 }}>
                <Ionicons name="trash-outline" size={20} color={theme.danger} />
            </TouchableOpacity>
        </View>

        <View style={[styles.contentRow, { backgroundColor: theme.dark ? 'rgba(255,255,255,0.05)' : '#F5F5F5' }]}>
            <Text style={[styles.messageText, { color: theme.text }]}>{item.message}</Text>
            <View style={[styles.miniReactionBadge, { borderColor: theme.border, backgroundColor: theme.card }]}>
                <Text style={styles.reactionEmoji}>{item.emoji}</Text>
            </View>
        </View>

        <View style={styles.footerRow}>
            <Text style={[styles.dateText, { color: theme.subText }]}>
                {new Date(item.created_at).toLocaleDateString()}
            </Text>
            <TouchableOpacity onPress={() => onEdit(item)} style={[styles.editButton, { backgroundColor: theme.primary + '20' }]}>
                <Text style={[styles.editButtonText, { color: theme.primary }]}>Modifier</Text>
            </TouchableOpacity>
        </View>
    </View>
);

// TAB: REÇUS
const ReceivedRecommendations = ({ theme, user }) => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchRecommendations = async () => {
        if (!user) return;
        try {
            const result = await executeQuery('get_my_recommendations', { user_id: user.id });
            if (result.success) setRecommendations(result.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(useCallback(() => { fetchRecommendations(); }, [user]));

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchRecommendations();
        setRefreshing(false);
    };

    if (loading && !refreshing) return <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 50 }} />;

    return (
        <FlatList
            data={recommendations}
            renderItem={({ item }) => <ReceivedItem item={item} theme={theme} />}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} tintColor={theme.primary} />}
            ListEmptyComponent={
                <View style={styles.emptyContainer}>
                    <Text style={{ color: theme.subText }}>Aucune recommandation reçue.</Text>
                </View>
            }
        />
    );
};

// TAB: ENVOYÉS
const SentRecommendations = ({ navigation, theme, user }) => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchSent = async () => {
        if (!user) return;
        try {
            const result = await executeQuery('get_sent_recommendations', { user_id: user.id });
            if (result.success) setRecommendations(result.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(useCallback(() => { fetchSent(); }, [user]));

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchSent();
        setRefreshing(false);
    };

    const handleDelete = (item) => {
        Alert.alert("Supprimer", "Voulez-vous supprimer cette recommandation ?", [
            { text: "Annuler", style: "cancel" },
            {
                text: "Supprimer", style: "destructive", onPress: async () => {
                    const res = await executeQuery('delete_recommendation', { id: item.id, sender_id: user.id });
                    if (res.success) setRecommendations(prev => prev.filter(r => r.id !== item.id));
                }
            }
        ]);
    };

    const handleEdit = (item) => {
        navigation.navigate('SendRecommendation', { recommendation: item });
    };

    if (loading && !refreshing) return <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 50 }} />;

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={recommendations}
                renderItem={({ item }) => <SentItem item={item} theme={theme} onDelete={handleDelete} onEdit={handleEdit} />}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} tintColor={theme.primary} />}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={{ color: theme.subText }}>Aucune recommandation envoyée.</Text>
                    </View>
                }
            />
            <TouchableOpacity style={[styles.fab, { backgroundColor: theme.primary }]} onPress={() => navigation.navigate('SendRecommendation')}>
                <Ionicons name="add" size={32} color="#fff" />
            </TouchableOpacity>
        </View>
    );
};


export default function RecommendationScreen({ navigation }) {
    const { user, theme } = useAuth();
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'received', title: 'Reçues' },
        { key: 'sent', title: 'Envoyées' },
    ]);

    const renderScene = SceneMap({
        received: () => <ReceivedRecommendations theme={theme} user={user} />,
        sent: () => <SentRecommendations navigation={navigation} theme={theme} user={user} />,
    });

    return (
        <SafeAreaProvider>
            <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
                <View style={[styles.headerContainer, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
                    <Text style={[styles.screenTitle, { color: theme.primary }]}>Recommandations</Text>
                </View>
                <TabView
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    initialLayout={{ width: 100 }}
                    renderTabBar={props => (
                        <TabBar 
                            {...props} 
                            indicatorStyle={{ backgroundColor: theme.primary }} 
                            style={{ backgroundColor: theme.card, borderBottomColor: theme.border, borderBottomWidth: 1 }} 
                            activeColor={theme.primary} 
                            inactiveColor={theme.subText || 'gray'}
                            labelStyle={{ fontWeight: '600' }} 
                        />
                    )}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    headerContainer: { paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1 },
    screenTitle: { fontSize: 28, fontWeight: 'bold' },
    listContent: { padding: 16, paddingBottom: 90 },
    card: { borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: 1, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
    headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    avatarContainer: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', marginRight: 10 },
    profileImage: { width: '100%', height: '100%' },
    initialsText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
    headerTextContainer: { flex: 1, justifyContent: 'center' },
    senderText: { fontSize: 12, marginBottom: 2 },
    username: { fontWeight: 'bold' },
    movieTitle: { fontSize: 15, fontWeight: '700' },
    contentRow: { flexDirection: 'row', alignItems: 'flex-end', padding: 10, borderRadius: 8 },
    messageText: { flex: 1, fontSize: 14, lineHeight: 20, marginRight: 8 },
    miniReactionBadge: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
    reactionEmoji: { fontSize: 18 },
    footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)' },
    dateText: { fontSize: 12 },
    editButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 },
    editButtonText: { fontSize: 12, fontWeight: '600' },
    fab: { position: 'absolute', bottom: 30, right: 30, width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3 },
    emptyContainer: { alignItems: 'center', marginTop: 50 },
});