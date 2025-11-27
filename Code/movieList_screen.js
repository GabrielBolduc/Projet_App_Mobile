import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { executeQuery } from './services/api'; 

const PRIMARY_COLOR = '#4A6572';

export default function MovieListScreen({ navigation }) {
  // stocker film de la bd
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // chargement donne
  useEffect(() => {
    const fetchMovies = async () => {
      const result = await executeQuery('get_all_movies');
      
      if (result.success) {
        setMovies(result.data);
      }
      setLoading(false);
    };

    fetchMovies();
  }, []);

  const handleSelectMovie = (movie) => {
    navigation.navigate('RateMovie', { selection: movie });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.movieItem} onPress={() => handleSelectMovie(item)}>
      <View style={styles.iconContainer}>
         <Ionicons name="film-outline" size={24} color={PRIMARY_COLOR} />
      </View>
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
            data={movies} 
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
                <View style={styles.loadingContainer}>
                    <Text style={{color: '#888'}}>Aucun film disponible.</Text>
                </View>
            }
        />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
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