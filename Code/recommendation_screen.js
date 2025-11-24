import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

const PRIMARY_COLOR = '#4A6572';

const RECOMMENDATIONS = [
    { id: '1', name: 'Inglorious Basterds', reason: 'Because you watched Django', reaction: '😎' },
    { id: '2', name: 'Pulp Fiction', reason: 'Good classic movie', reaction: '🔥' },
    { id: '3', name: 'The Dark Knight', reason: 'You liked Batman Begins', reaction: '🦇' },
];

const Item = ({ name, reason, reaction }) => (
    <View style={styles.card}>
        <View style={styles.iconContainer}>
            <Text style={{fontSize: 24}}>{reaction}</Text>
        </View>
        <View style={styles.textContainer}>
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.reason}>{reason}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </View>
);

export default function RecommendationScreen() {
  return (
      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>

        <FlatList
            data={RECOMMENDATIONS}
            renderItem={({ item }) => <Item name={item.name} reason={item.reason} reaction={item.reaction} />}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
        />

        <TouchableOpacity style={styles.fab}>
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
    listContent: {
        padding: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    iconContainer: {
        width: 50, 
        height: 50, 
        borderRadius: 25, 
        backgroundColor: '#F0F0F0', 
        justifyContent: 'center', 
        alignItems: 'center',
        marginRight: 15
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    reason: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
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