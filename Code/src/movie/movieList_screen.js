import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { executeQuery } from '../services/api'; 
import { useAuth } from '../context/authContext';

const PRIMARY_COLOR = '#4A6572';

export default function MovieListScreen({ navigation }) {
  // recup theme
  const { theme } = useAuth();
  
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
    navigation.navigate({
      name: 'RateMovie',
      params: { selection: movie },
      merge: true,
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 

      style={[styles.movieItem, { borderBottomColor: theme.border }]} 
      onPress={() => handleSelectMovie(item)}
    >
      <View style={styles.iconContainer}>
         <Ionicons name="film-outline" size={24} color={theme.primary} />
      </View>
      <View style={styles.infoContainer}>
        {/* Titre en couleur principale */}
        <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
        {/* Détails en couleur secondaire */}
        <Text style={[styles.details, { color: theme.subText }]}>
          {item.director} • {item.duration} min
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.subText} />
    </TouchableOpacity>
  );

  return (
  
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      
      {/* header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color={theme.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.primary }]}>Liste de films</Text>
        <View style={{ width: 28 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} style={{marginTop: 50}} />
      ) : (
        <FlatList
            data={movies} 
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
                <View style={{flex:1, alignItems:'center', marginTop:50}}>
                    <Text style={{color: theme.subText}}>Aucun film disponible.</Text>
                </View>
            }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingVertical: 15, 
    borderBottomWidth: 1, 
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
  },
  listContent: { 
    paddingBottom: 20, 
  },
  movieItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 15, 
    borderBottomWidth: 1, 
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
    marginBottom: 4, 
  },
  details: { 
    fontSize: 14, 
  },
});