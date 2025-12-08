import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native'; 
import { executeQuery } from '../services/api'; 
import { useAuth } from '../context/authContext'; 

const PRIMARY_COLOR = '#4A6572';

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
  // recup user et theme
  const { user, theme } = useAuth(); 
  
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRatings = async () => {
    try {
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

  useFocusEffect(
    useCallback(() => {
      fetchRatings();
    }, [user])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRatings();
    setRefreshing(false);
  };

  const handleEditPress = (item) => {
    navigation.navigate('RateMovie', { item: item });
  };

  const handleAddPress = () => {
    navigation.navigate('RateMovie');
  };

  const renderRatingItem = ({ item }) => (
    <TouchableOpacity 
      // application couleur dynamique 
      style={[styles.card, { backgroundColor: theme.card }]} 
      onPress={() => handleEditPress(item)} 
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        {/* header */}
        <View style={styles.cardHeader}>
          <Text style={[styles.movieTitle, { color: theme.text }]}>{item.movie_title}</Text>
          <Text style={[styles.dateText, { color: theme.subText }]}>
            {item.created_at ? new Date(item.created_at).toLocaleDateString('fr-CA') : ''}
          </Text>
        </View>

        {/* stars */}
        <View style={styles.ratingContainer}>
          <StarRating rating={item.rating} />
        </View>

        {/* commentaire */}
        {item.comment ? (
         
          <Text style={[styles.commentText, { color: theme.subText }]} numberOfLines={3}>
            {item.comment}
          </Text>
        ) : (
          <Text style={[styles.noCommentText, { color: theme.subText }]}>Aucun commentaire</Text>
        )}
      </View>
      
    </TouchableOpacity>
  );

  return (
    <SafeAreaProvider>
      {/* 3. Fond d'écran dynamique */}
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        
        {/* header */}
        <View style={[styles.headerContainer, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
           <Text style={[styles.screenTitle, { color: theme.primary }]}>Mes Ratings</Text>
        </View>

        {/* list */}
        {loading && !refreshing ? (
             <ActivityIndicator size="large" color={theme.primary} style={{marginTop: 50}} />
        ) : (
            <FlatList
            data={ratings}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderRatingItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} tintColor={theme.primary} />
            }
            
            ListEmptyComponent={
                <View style={styles.emptyContainer}>
                    <Text style={[styles.emptyText, { color: theme.subText }]}>Vous n'avez pas encore noté de films.</Text>
                </View>
            }
            />
        )}

        {/* btn */}
        <TouchableOpacity 
          style={[styles.fab, { backgroundColor: theme.primary }]} 
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
    // backgroundColor gere dynamiquement
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    // backgroundColor et borderBottomColor gere dynamiquement
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    // color gere dynamiquement
  },
  listContent: {
    padding: 20,
    paddingBottom: 80, 
  },
  card: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row', 
    justifyContent: 'space-between',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
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
    flex: 1, 
    marginRight: 10,
    // color gere dynamiquement
  },
  dateText: {
    fontSize: 12,
    // color gere dynamiquement
  },
  ratingContainer: {
    marginBottom: 8,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    // color gere dynamiquement
  },
  noCommentText: {
    fontSize: 14,
    fontStyle: 'italic',
    // color gere dynamiquement
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    // color gere dynamiquement
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    // backgroundColor gere dynamiquement
  },
});