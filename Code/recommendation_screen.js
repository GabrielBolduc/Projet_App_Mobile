import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

const PRIMARY_COLOR = '#4A6572';

const RECOMMENDATIONS = [
    { id: '1', user: 'Thomas', name: 'Inglorious Basterds', reason: 'Car tu as aimé Django Unchained', reaction: '😎' },
    { id: '2', user: 'Sarah', name: 'Pulp Fiction', reason: 'Un classique absolu à voir', reaction: '🔥' },
    { id: '3', user: 'Mike', name: 'The Dark Knight', reason: 'Puisque tu es fan de Nolan', reaction: '🦇' },
];

const Item = ({ user, name, reason, reaction }) => (
    <View style={styles.card}>
        {/* L'utilisateur qui recommande */}
        <View style={styles.cardHeader}>
            <Ionicons name="person-circle" size={34} color={PRIMARY_COLOR} style={{ marginRight: 8 }} />
            <Text style={styles.headerText}>
                <Text style={styles.username}>{user}</Text> vous recommande :
            </Text>
        </View>

        {/* Nom du film */}
        <View style={styles.movieContainer}>
            <Ionicons name="film-outline" size={20} color="#666" style={{ marginRight: 8 }} />
            <Text style={styles.movieTitle}>{name}</Text>
        </View>

        <View style={styles.divider} />

        {/* Raison */}
        <Text style={styles.labelText}>Raison :</Text>
        <Text style={styles.reasonText}>{reason}</Text>

        {/* Réaction */}
        <View style={styles.reactionContainer}>
            <Text style={styles.labelText}>Réaction :</Text>
            <Text style={styles.reactionEmoji}>{reaction}</Text>
        </View>
    </View>
);

export default function Recommendation({ navigation }) {
  return (
      <SafeAreaView style={styles.container}>

        <View style={styles.headerContainer}>
            <Text style={styles.screenTitle}>Recommendation</Text>
        </View>
        
        <FlatList
            data={RECOMMENDATIONS}
            renderItem={({ item }) => (
                <Item 
                    user={item.user} 
                    name={item.name} 
                    reason={item.reason} 
                    reaction={item.reaction} 
                />
            )}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
        />

        <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddRecommendation')}>
            <Ionicons name="add" size={30} color="#fff" />
        </TouchableOpacity>

      </SafeAreaView>
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
        bottom: 20,
        right: 20,
        backgroundColor: PRIMARY_COLOR,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3,
    },
});