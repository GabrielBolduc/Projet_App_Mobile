import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY_COLOR = '#4A6572';
const TEXT_COLOR = '#333';
const SUBTLE_COLOR = '#888';


const POPULAR_MOVIES_DATA = [
  { id: 1, title: 'Dune: Part Two', duration: 100, director: 'Denis Villeneuve' },
  { id: 2, title: 'Oppenheimer', duration: 111, director: 'Christopher Nolan' },
  { id: 3, title: 'The Trueman Show', duration: 112, director: 'Peter Weir' },
];

const RATINGS_FEED_DATA = [
  {
    id: 101, 
    user_id: 50,
    username: 'Sophie', 
    movie_title: 'Dune: Part Two',
    rating: 5, 
    comment: 'Tres bon film, mauvaise fin', 
    created_at: '2025-11-23 09:30:00',
    initialLikes: 12,
    initialDislikes: 0,
  },
  {
    id: 102,
    user_id: 51,
    username: 'Marc',
    movie_title: 'The Batman',
    rating: 4,
    comment: 'Tres sombre, un peu long mais bien filmer.',
    created_at: '2025-11-22 18:45:00',
    initialLikes: 8,
    initialDislikes: 1
  },
  {
    id: 103,
    user_id: 52,
    username: 'Joe',
    movie_title: 'Dazed and Confused',
    rating: 3,
    comment: 'Excellement mais a mal vieilli.',
    created_at: '2025-11-20 14:00:00',
    initialLikes: 4,
    initialDislikes: 2,
    currentUserReaction: 'like', 
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

// Review follower
function ReviewCard({ item }) {
  const [reactionState, setReactionState] = useState(item.currentUserReaction); 
  const [likesCount, setLikesCount] = useState(item.initialLikes);
  const [dislikesCount, setDislikesCount] = useState(item.initialDislikes);

  const handleReaction = (type) => {
    if (reactionState === type) {
      setReactionState(null);
      if (type === 'like') setLikesCount(prev => prev - 1);
      else setDislikesCount(prev => prev - 1);
    } else {
        
      if (reactionState === 'like' && type === 'dislike') {
        setLikesCount(prev => prev - 1);
      } else if (reactionState === 'dislike' && type === 'like') {
        setDislikesCount(prev => prev - 1);
      }

      setReactionState(type);
      if (type === 'like') setLikesCount(prev => prev + 1);
      else setDislikesCount(prev => prev + 1);
    }
  };

  return (
    <View style={styles.reviewCard}>
      {/* header */}
      <View style={styles.cardHeader}>
        <View style={styles.userInfo}>
          <View>
            <Text style={styles.userName}>{item.username}</Text>
            <Text style={styles.timestamp}>
                {new Date(item.created_at).toLocaleDateString('en-CA')}
            </Text>
          </View>
        </View>
      </View>

      {/* content */}
      <View style={styles.cardContent}>
        <Text style={styles.movieTitle}>{item.movie_title}</Text>
        <View style={styles.ratingContainer}>
          <StarRating rating={item.rating} />
        </View>
        <Text style={styles.commentText}>{item.comment}</Text>
      </View>

      {/* footer */}
      <View style={styles.cardFooter}>
        <TouchableOpacity 
          style={styles.reactionButton} 
          onPress={() => handleReaction('like')}
        >
          <Ionicons 
            name={reactionState === 'like' ? "thumbs-up" : "thumbs-up-outline"} 
            size={20} 
            color={reactionState === 'like' ? PRIMARY_COLOR : SUBTLE_COLOR} 
          />
          <Text>
            {likesCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.reactionButton} 
          onPress={() => handleReaction('dislike')}
        >
          <Ionicons 
            name={reactionState === 'dislike' ? "thumbs-down" : "thumbs-down-outline"} 
            size={20} 
            color={reactionState === 'dislike' ? '#D32F2F' : SUBTLE_COLOR} 
          />
          <Text>
            {dislikesCount}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function Feed() {

  const renderPopularItem = ({ item }) => (
    <View style={styles.popularCard}>
      <View style={styles.posterPlaceholder}>
        <Ionicons name="film-outline" size={32} color="#fff" />
      </View>
      <Text style={styles.popularTitle} >{item.title}</Text>
      <Text style={styles.popularDirector}>{item.director}</Text>
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        
        <View style={styles.headerContainer}>
           <Text style={styles.screenTitle}>Feed</Text>
        </View>

        <FlatList
          data={RATINGS_FEED_DATA}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <ReviewCard item={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          
          ListHeaderComponent={
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Popular</Text>
              <View style={styles.popularListContainer}>
                {POPULAR_MOVIES_DATA.map((movie) => (
                  <View key={movie.id} style={styles.popularWrapper}>
                     {renderPopularItem({ item: movie })}
                  </View>
                ))}
              </View>
              <Text style={styles.sectionTitle}>By your friends</Text>
            </View>
          }
        />

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
    paddingBottom: 20,
  },
  sectionContainer: {
    padding: 20,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: TEXT_COLOR,
    marginBottom: 15,
    marginTop: 5,
  },
  // Populaire
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
    backgroundColor: PRIMARY_COLOR,
  },
  popularTitle: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    color: TEXT_COLOR,
    marginBottom: 2,
  },
  popularDirector: {
    fontSize: 10,
    color: SUBTLE_COLOR,
    textAlign: 'center',
  },

  reviewCard: {
    backgroundColor: '#fff',
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
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 14,
    color: TEXT_COLOR,
  },
  timestamp: {
    fontSize: 12,
    color: SUBTLE_COLOR,
  },
  cardContent: {
    marginBottom: 10,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: TEXT_COLOR,
    marginBottom: 5,
  },
  ratingContainer: {
    marginBottom: 8,
  },
  commentText: {
    color: '#555',
    lineHeight: 20,
    fontSize: 14,
  },
  cardFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
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