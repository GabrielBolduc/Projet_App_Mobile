import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native'; 
import { executeQuery } from './services/api'; 
import { useAuth } from './context/AuthContext'; 

const PRIMARY_COLOR = '#4A6572';
const TEXT_COLOR = '#333';
const SUBTLE_COLOR = '#888';

function StarRating({ rating }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Ionicons
        key={i}
        name={i <= rating ? "star" : "star-outline"}
        size={16}
        color="#FFD700"
        style={{ marginRight: 2 }}
      />
    );
  }
  return <View style={{ flexDirection: 'row' }}>{stars}</View>;
}

export default function MyRatings({ navigation }) {
  const { user } = useAuth(); // user connecter
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // charcher donne depuis martha
  const fetchRatings = async () => {
    
    try {
        // appel api
        const result = await executeQuery('get_my_ratings', { user_id: user.id });
        
        if (result.success) {
            setRatings(result.data);
        } else {
            console.log("Erreur récupération ratings:", result.error);
        }
    } catch (e) {
        console.error("Erreur réseau:", e);
    } finally {
        setLoading(false);
    }
  };

  // reload ecran (pour voir les nouveaux rating)
  useFocusEffect(
    useCallback(() => {
      fetchRatings();
    }, [user])
  );

  // !!!
  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRatings();
    setRefreshing(false);
  };

  // navig vers mode edit
  const handleEditPress = (item) => {
    navigation.navigate('RateMovie', { item: item });
  };

  // navig vers mode add
  const handleAddPress = () => {
    navigation.navigate('RateMovie');
  };

  const renderRatingItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => handleEditPress(item)} 
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        {/* header */}
        <View style={styles.cardHeader}>
          <Text style={styles.movieTitle}>{item.movie_title}</Text>
          <Text style={styles.dateText}>
            {item.created_at ? new Date(item.created_at).toLocaleDateString('fr-CA') : ''}
          </Text>
        </View>

        {/* etoiles */}
        <View style={styles.ratingContainer}>
          <StarRating rating={item.rating} />
        </View>

        {/* commentaire */}
        {item.comment ? (
          <Text style={styles.commentText} numberOfLines={3}>
            {item.comment}
          </Text>
        ) : (
          <Text style={styles.noCommentText}>Aucun commentaire</Text>
        )}
      </View>
      
    </TouchableOpacity>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        
        {/* header */}
        <View style={styles.headerContainer}>
           <Text style={styles.screenTitle}>My ratings</Text>
        </View>

        {/* list */}
        {loading && !refreshing ? (
             <ActivityIndicator size="large" color={PRIMARY_COLOR} style={{marginTop: 50}} />
        ) : (
            <FlatList
            data={ratings}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderRatingItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[PRIMARY_COLOR]} />
            }
            
            ListEmptyComponent={
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Vous n'avez pas encore noté de films.</Text>
                </View>
            }
            />
        )}

        {/* btn */}
        <TouchableOpacity 
          style={styles.fab} 
          onPress={handleAddPress}
        >
          <Ionicons name="add" size={32} color="#fff" />
        </TouchableOpacity>

      </SafeAreaView>
    </SafeAreaProvider>
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
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row', 
    justifyContent: 'space-between',
    // Ombre
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flex: 1, 
    marginRight: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: TEXT_COLOR,
    flex: 1, 
    marginRight: 10,
  },
  dateText: {
    fontSize: 12,
    color: SUBTLE_COLOR,
  },
  ratingContainer: {
    marginBottom: 8,
  },
  commentText: {
    color: '#555',
    fontSize: 14,
    lineHeight: 20,
  },
  noCommentText: {
    color: '#aaa',
    fontSize: 14,
    fontStyle: 'italic',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: SUBTLE_COLOR,
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});