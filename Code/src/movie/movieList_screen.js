import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { executeQuery } from '../services/api'; 

const PRIMARY_COLOR = '#4A6572';

export default function MovieListScreen({ navigation }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        //
        const result = await executeQuery('get_all_movies');
        if (result.success) {
          setMovies(result.data);
        }
      } catch (e) {
        console.error("Erreur chargement films:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleSelectMovie = (movie) => {
    // CORRECTION NAVIGATION : 
    // 'merge: true' met à jour l'écran RateMovie en arrière-plan sans en empiler un nouveau.
    navigation.navigate({
      name: 'RateMovie',
      params: { selection: movie },
      merge: true,
    });
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
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color={PRIMARY_COLOR} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Liste de films</Text>
        <View style={{ width: 28 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={PRIMARY_COLOR} style={{marginTop: 50}} />
      ) : (
        <FlatList
            data={movies} 
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
                <View style={{flex:1, alignItems:'center', marginTop:50}}>
                    <Text style={{color: '#888'}}>Aucun film disponible.</Text>
                </View>
            }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: PRIMARY_COLOR },
  listContent: { paddingBottom: 20 },
  movieItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  iconContainer: { marginRight: 15, width: 40, alignItems: 'center' },
  infoContainer: { flex: 1 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  details: { fontSize: 14, color: '#666' },
});