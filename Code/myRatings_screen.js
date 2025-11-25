import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY_COLOR = '#4A6572';
const TEXT_COLOR = '#333';
const SUBTLE_COLOR = '#888';

// SELECT * FROM Ratings JOIN Movie WHERE user_id = MOI
const MY_RATINGS_DATA = [
  {
    id: 201,
    movie_id: 1,
    movie_title: 'Dune: Part Two',
    rating: 5,
    comment: 'Sur la coche',
    created_at: '2025-11-23 09:30:00',
  },
  {
    id: 202,
    movie_id: 12,
    movie_title: 'Spider-Man: Across the Spider-Verse',
    rating: 5,
    comment: 'Bonne histoire',
    created_at: '2025-10-15 14:20:00',
  },
  {
    id: 203,
    movie_id: 7,
    movie_title: 'Napoleon',
    rating: 3,
    comment: 'Trop lent',
    created_at: '2025-11-20 20:00:00',
  },
  {
    id: 204,
    movie_id: 9,
    movie_title: 'Five Nights at Freddys',
    rating: 1,
    comment: 'Mauvais.',
    created_at: '2025-11-01 18:45:00',
  },
];

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

  const handleEditPress = () => {
    
  };

  const handleAddPress = () => {
    navigation.navigate('RateMovie')
  };

  const renderRatingItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => handleEditPress(item)} 
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.movieTitle}>{item.movie_title}</Text>
          <Text style={styles.dateText}>
            {new Date(item.created_at).toLocaleDateString('en-CA')}
          </Text>
        </View>

        <View style={styles.ratingContainer}>
          <StarRating rating={item.rating} />
        </View>

        {item.comment ? (
          <Text style={styles.commentText}>
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

        {/* rating list */}
        <FlatList
          data={MY_RATINGS_DATA}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderRatingItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Vous n'avez pas encore noté de films.</Text>
            </View>
          }
        />

        {/* btn add */}
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
    paddingBottom: 80, //bouton FAB
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row', // Pour aligner contenu et icone edit
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flex: 1, 
    marginRight: 10,
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
  editIconContainer: {
    padding: 5,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: SUBTLE_COLOR,
    fontSize: 16,
  },
  // Floating Action Button (FAB)
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
  },
});