import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

const PRIMARY_COLOR = '#4A6572';

const FOLLOWERS = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Alice Johnson' },
    { id: '4', name: 'Bob Brown' },
];

const Item = ({ name }) => (
    <View style={styles.card}>
        <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
                <Ionicons name="person" size={24} color="#fff" />
            </View>
            <Text style={styles.title}>{name}</Text>
        </View>
        <TouchableOpacity>
            <Ionicons name="close-circle-outline" size={28} color="#D32F2F" />
        </TouchableOpacity>
    </View>
);

export default function FollowScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>

        <View style={styles.listContainer}>
            <FlatList
                data={FOLLOWERS}
                renderItem={({ item }) => <Item name={item.name} />}
                keyExtractor={item => item.id}
                contentContainerStyle={{ paddingBottom: 100, paddingTop: 20 }}
            />
        </View>

        <TouchableOpacity style={styles.fab}>
            <Ionicons name="person-add" size={24} color="#fff" />
        </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    listContainer: {
        flex: 1,
        paddingHorizontal: 20,
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
        bottom: 20,
        right: 20,
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