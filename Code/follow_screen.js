import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';


const FOLLOWERS = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Alice Johnson' },
    { id: '4', name: 'Bob Brown' },
];

const Item = ({ name }) => (
    <View style={styles.item}>
        <View style={styles.avatarContainer}>
            <Ionicons name="person-circle-outline" size={32} color="#4A6572" />
        </View>
        <Text style={styles.title}>{name}</Text>
        <TouchableOpacity style={styles.RemoveButton}>
            <Ionicons name="close-circle" size={32} color="red" />
        </TouchableOpacity>
    </View>
);

const FollowersList = () => {
    if (FOLLOWERS.length === 0) {
        return <Text>No followers yet.</Text>;
    } else {
        return (
            <FlatList styles={styles.list}
                data={FOLLOWERS}
                renderItem={({ item }) => <Item name={item.name} />}
                keyExtractor={item => item.id}
            />
        );
    }
}

export default function FollowScreen() {
  return (
    <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Your Followers</Text>
            </View>

            <View style={styles.followersSection}>
                <FollowersList />
            </View>

            <View style={styles.addFollower}>
                <TouchableOpacity style={[styles.addFollowerButton, { height: 55, width: 200}] }>
                    <Ionicons name="person-add-outline" size={24} color="#4A6572" />
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0d4b0ff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        marginBottom: 40,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#4A6572',
    },
    followersSection: {
        width: '50%',
        height: '50%',
        marginTop: 20,
    },
    item: {
        backgroundColor: '#f3ca89ff',
        borderWidth: 3,
        borderColor: 'darkgray',
        padding: 20,
        marginVertical: 8,
        borderRadius: 10,
    },
    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
    },
    RemoveButton: {
        position: 'absolute',
        right: 5,
    },
    avatarContainer: {
        width: 48,
        height: 48,
        borderRadius: 24, 
        borderWidth: 2,
        borderColor: '#4A6572', 
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginRight: 16,
    },
    addFollower: {
        marginTop: 30,
    },
    addFollowerButton: {
        backgroundColor: '#f3ca89ff',
        borderWidth: 3,
        borderColor: 'darkgray',
        padding: 20,
        marginVertical: 8,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
}); 