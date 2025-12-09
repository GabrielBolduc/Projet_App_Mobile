import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator, Image } from 'react-native'; // Ajout de Image
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

// review card
function ReviewCard({ item, currentUserId }) {
  const { theme } = useAuth(); // recup theme
  
  const [reactionState, setReactionState] = useState(item.current_user_reaction || null); 
  const [likesCount, setLikesCount] = useState(item.likes_count || 0);
  const [dislikesCount, setDislikesCount] = useState(item.dislikes_count || 0);

  // update local state quand donne change
  useEffect(() => {
    setReactionState(item.current_user_reaction || null);
    setLikesCount(item.likes_count || 0);
    setDislikesCount(item.dislikes_count || 0);
  }, [item]);

  const handleReaction = async (newType) => {
    let nextState = null;
    let nextLikes = likesCount;
    let nextDislikes = dislikesCount;

    if (reactionState === newType) {
      nextState = null; 
      if (newType === 'like') nextLikes = Math.max(0, likesCount - 1);
      else nextDislikes = Math.max(0, dislikesCount - 1);
    } 
    else {
      nextState = newType;
      if (reactionState === 'like') nextLikes = Math.max(0, likesCount - 1);
      if (reactionState === 'dislike') nextDislikes = Math.max(0, dislikesCount - 1);
      
      if (newType === 'like') nextLikes++;
      else nextDislikes++;
    }

    setReactionState(nextState);
    setLikesCount(nextLikes);
    setDislikesCount(nextDislikes);

    if (nextState === null) {
        await executeQuery('remove_reaction', {
            user_id: currentUserId,
            rating_id: item.id
        });
    } else {
        await executeQuery('add_reaction', {
            user_id: currentUserId,
            rating_id: item.id,
            type: nextState
        });
    }
  };

  return (
    <View style={[styles.reviewCard, { backgroundColor: theme.card }]}>
      {/* header */}
      <View style={styles.cardHeader}>
        <View style={styles.userInfo}>
          
          {/* affichage photo*/}
          {item.photo_profile ? (
             <Image 
                source={{ uri: item.photo_profile }} 
                style={styles.avatar} 
             />
          ) : (
             <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
                <Text style={{color:'#fff', fontWeight:'bold'}}>
                   {item.username ? item.username.charAt(0).toUpperCase() : '?'}
                </Text>
             </View>
          )}

          <View>
            <Text style={[styles.userName, { color: theme.text }]}>{item.username}</Text>
            <Text style={[styles.timestamp, { color: theme.subText }]}>
                {item.created_at ? new Date(item.created_at).toLocaleDateString('fr-CA') : ''}
            </Text>
          </View>
        </View>
      </View>

      {/* content */}
      <View style={styles.cardContent}>
        <Text style={[styles.movieTitle, { color: theme.text }]}>{item.movie_title}</Text>
        <View style={styles.ratingContainer}>
          <StarRating rating={item.rating} />
        </View>
        <Text style={[styles.commentText, { color: theme.subText }]}>{item.comment}</Text>
      </View>

      {/* footer */}
      <View style={[styles.cardFooter, { borderTopColor: theme.border }]}>
        <TouchableOpacity 
          style={styles.reactionButton} 
          onPress={() => handleReaction('like')}
          activeOpacity={0.7}
        >
          <Ionicons 
            name={reactionState === 'like' ? "thumbs-up" : "thumbs-up-outline"} 
            size={20} 
            color={reactionState === 'like' ? theme.primary : theme.subText} 
          />
          <Text style={[styles.reactionCount, {color: reactionState === 'like' ? theme.primary : theme.subText}]}>
            {likesCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.reactionButton} 
          onPress={() => handleReaction('dislike')}
          activeOpacity={0.7}
        >
          <Ionicons 
            name={reactionState === 'dislike' ? "thumbs-down" : "thumbs-down-outline"} 
            size={20} 
            color={reactionState === 'dislike' ? theme.danger : theme.subText} 
          />
          <Text style={[styles.reactionCount, {color: reactionState === 'dislike' ? theme.danger : theme.subText}]}>
            {dislikesCount}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function Feed() {
  const { user, theme } = useAuth(); // Ajout de theme
  const [popularMovies, setPopularMovies] = useState([]);
  const [feedData, setFeedData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    if (!user) return;

    try {
        const popRes = await executeQuery('get_popular_movies');
        if (popRes.success) setPopularMovies(popRes.data);

        const feedRes = await executeQuery('get_feed', { user_id: user.id });
        if (feedRes.success) setFeedData(feedRes.data);
    } catch (e) {
        console.error("Erreur chargement feed:", e);
    } finally {
        setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      fetchAllData();
    }, [user])
  );

  const renderPopularItem = ({ item }) => (
    <View style={styles.popularCard}>
      <View style={[styles.posterPlaceholder, { backgroundColor: theme.primary }]}>
        <Ionicons name="film-outline" size={32} color="#fff" />
      </View>
      <Text style={[styles.popularTitle, { color: theme.text }]} numberOfLines={2}>{item.title}</Text>
      <Text style={[styles.popularDirector, { color: theme.subText }]} numberOfLines={1}>{item.director}</Text>
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.headerContainer, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
           <Text style={[styles.screenTitle, { color: theme.primary }]}>Feed</Text>
        </View>

        {loading && !refreshing ? (
            <ActivityIndicator size="large" color={theme.primary} style={{marginTop: 50}} />
        ) : (
            <FlatList
            data={feedData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <ReviewCard 
                    item={item} 
                    currentUserId={user ? user.id : 0} 
                />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} tintColor={theme.primary} />
            }
            ListHeaderComponent={
                <View style={styles.sectionContainer}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Populaire</Text>
                <View style={styles.popularListContainer}>
                    {popularMovies.length > 0 ? (
                        popularMovies.map((movie) => (
                        <View key={movie.id} style={styles.popularWrapper}>
                            {renderPopularItem({ item: movie })}
                        </View>
                        ))
                    ) : (
                        <Text style={{color: theme.subText, fontStyle:'italic'}}>Loading movies...</Text>
                    )}
                </View>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Par vos amis</Text>
                </View>
            }
            ListEmptyComponent={
                <View style={{alignItems:'center', marginTop: 20}}>
                    <Text style={{color: theme.subText}}>Aucune activité récente.</Text>
                </View>
            }
            />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 20,
  },
  sectionContainer: {
    padding: 20,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 5,
  },
  popularListContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  popularWrapper: {
    width: '30%',
  },
  popularCard: {
    alignItems: 'center',
  },
  posterPlaceholder: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  popularTitle: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
  },
  popularDirector: {
    fontSize: 10,
    textAlign: 'center',
  },
  reviewCard: {
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  timestamp: {
    fontSize: 12,
  },
  cardContent: {
    marginBottom: 10,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  ratingContainer: {
    marginBottom: 8,
  },
  commentText: {
    lineHeight: 20,
    fontSize: 14,
  },
  cardFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 10,
    marginTop: 5,
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 25, 
  },
  reactionCount: {
    marginLeft: 6,
    fontWeight: '600',
    fontSize: 14,
  },
});