import React from "react";

import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

const RECOMMENDATIONS = [
    { id: '1', name: 'Inglorious Basterds', reason: 'Because you watched Django Unchained', reaction: '😎' },
    { id: '2', name: 'Pulp Fiction', reason: 'Good classic movie', reaction: '🔥' },
    { id: '3', name: 'The Dark Knight', reason: 'Because you watched Batman Begins', reaction: '🦇' },
    { id: '4', name: 'Forrest Gump', reason: 'Highly rated drama', reaction: '❤️' },
    { id: '5', name: 'The Matrix', reason: 'Because you liked Inception', reaction: '🤯' },
    { id: '6', name: 'The Shawshank Redemption', reason: 'Top rated movie', reaction: '🏆' },
];


const Item = ({ name, reason, reaction }) => (
    <View style={styles.item}>
        
        <View style={styles.textContainer}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', paddingBottom: 10 }}>User recommend you:</Text>
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.reason}>{reason}</Text>
            <Text style={{ fontSize: 24, paddingTop: 10 }}>{reaction}</Text>
        </View>
    </View>
);

const RecommendationsList = () => {
    if (RECOMMENDATIONS.length === 0) {
        return <Text>No recommendations available.</Text>;
    } else {
        return (
            <FlatList styles={styles.list}
                data={RECOMMENDATIONS}
                renderItem={({ item }) => <Item name={item.name} reason={item.reason} reaction={item.reaction} />}
                keyExtractor={item => item.id}
            />
        );
    }
}

export default function RecommendationScreen() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>

        <View style={styles.header}>
            <Text style={styles.headerTitle}>Recommend by your followers</Text>
        </View>

        <View style={styles.recommendationsSection}>
            <RecommendationsList />
        </View>

        <View style={{ position: 'absolute', bottom: 20, right: 20 }}>
            <TouchableOpacity style={[styles.buttonAddRecom, { height: 55, width: 55, borderRadius: 27.5 }]}>
                <Ionicons name="add" size={32} color="#4A6572" />
            </TouchableOpacity>
        </View>

      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        marginTop: 20,
        marginBottom: 20,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#4A6572',
    },
    recommendationsSection: {
        width: '50%',
        height: '50%',
        marginTop: 20,
    },
    item: {
        backgroundColor: '#f3ca89ff',
        borderWidth: 3,
        borderColor: 'darkgray',
        padding: 20,
        marginVertical: 16,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    textContainer: {
        marginLeft: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4A6572',
    },
    reason: {
        fontSize: 18,
        color: '#4A6572',
    },
    buttonAddRecom: {
        backgroundColor: '#f3ca89ff',
        justifyContent: 'center',
        alignItems: 'center',
    },
});