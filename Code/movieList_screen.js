import React from 'react'; // Plus besoin de useState pour l'instant
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY_COLOR = '#4A6572';

const ALL_MOVIES = [
  { id: 1, title: 'Dune: Part Two', duration: 166, director: 'Denis Villeneuve' },
  { id: 2, title: 'Oppenheimer', duration: 180, director: 'Christopher Nolan' },
  { id: 3, title: 'Barbie', duration: 114, director: 'Greta Gerwig' },
  { id: 4, title: 'The Batman', duration: 176, director: 'Matt Reeves' },
  { id: 7, title: 'Napoleon', duration: 158, director: 'Ridley Scott' },
  { id: 8, title: 'Spider-Man: Across the Spider-Verse', duration: 140, director: 'Joaquim Dos Santos' },
  { id: 9, title: 'Five Nights at Freddy\'s', duration: 109, director: 'Emma Tammi' },
  { id: 10, title: 'Killers of the Flower Moon', duration: 206, director: 'Martin Scorsese' },
];

export default function MovieListScreen({ navigation }) {

  // Action quand on choisit un film
  const handleSelectMovie = (movie) => {
    navigation.navigate('RateMovie', { selection: movie });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.movieItem} onPress={() => handleSelectMovie(item)}>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.details}>
          {item.director} • {item.duration} min
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="close" size={28} color={PRIMARY_COLOR} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Liste de films</Text>
        <View style={{ width: 28 }} />
      </View>

      <FlatList
        data={ALL_MOVIES}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
  },
  listContent: {
    paddingBottom: 20,
  },
  movieItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  iconContainer: {
    marginRight: 15,
    width: 40,
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: '#666',
  },
});