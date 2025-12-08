import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { executeQuery } from '../services/api';
import { useAuth } from '../context/authContext';

const PRIMARY_COLOR = '#4A6572';
const DANGER_COLOR = '#D32F2F';

export default function RateMovieScreen({ navigation, route }) {
  // recup user et theme
  const { user, theme } = useAuth();
  
  const existingItem = route.params?.item;
  const isEditMode = !!existingItem; 

  const [selectedMovie, setSelectedMovie] = useState(
    existingItem 
      ? { id: existingItem.movie_id, title: existingItem.movie_title } 
      : null
  );
  
  const [rating, setRating] = useState(existingItem ? existingItem.rating : 0);
  const [comment, setComment] = useState(existingItem ? existingItem.comment : '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (route.params?.selection) {
      setSelectedMovie({
        id: route.params.selection.id,
        title: route.params.selection.title
      });
    }
  }, [route.params?.selection]);

  const goHome = () => {
      navigation.navigate('Home', { screen: 'Mes ratings' });
  };

  const handleSelectMoviePress = () => {
    if (!isEditMode) {
        navigation.navigate('MovieList');
    } else {
        Alert.alert("Info", "En mode modification, vous ne pouvez pas changer le film.");
    }
  };

  const handleSave = async () => {
    if (!selectedMovie || rating === 0) {
      Alert.alert("Erreur", "Vous devez sélectionner un film et mettre une note.");
      return;
    }
    if (!user) return;

    setIsSubmitting(true);

    try {
        let result;
        if (isEditMode) {
            result = await executeQuery('update_rating', {
                rating: rating,
                comment: comment,
                id: existingItem.id,
                user_id: user.id
            });
        } else {
            result = await executeQuery('create_rating', {
                user_id: user.id,
                movie_id: selectedMovie.id,
                rating: rating,
                comment: comment
            });
        }

        if (result.success) {
            goHome();
        } else {
            Alert.alert("Erreur", "Impossible de sauvegarder. Vérifiez si vous n'avez pas déjà noté ce film.");
        }
    } catch (e) {
        console.error(e);
        Alert.alert("Erreur", "Une erreur technique est survenue.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    Alert.alert("Supprimer", "Voulez-vous vraiment supprimer cet avis ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Supprimer", style: "destructive", onPress: async () => {
          setIsSubmitting(true);
          const res = await executeQuery('delete_rating', { id: existingItem.id, user_id: user.id });
          setIsSubmitting(false);
          
          if (res.success) {
             goHome();
          } else {
             Alert.alert("Erreur", "Impossible de supprimer.");
          }
      }}
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={goHome} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={PRIMARY_COLOR} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.primary }]}>
            {isEditMode ? "Modifier l'avis" : "Ajouter un avis"}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Card Film */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.text }]}>Film</Text>
          {selectedMovie ? (
            <TouchableOpacity 
                style={[
                    styles.selectedMovieCard, 
                    { 
                        backgroundColor: theme.card, 
                        borderColor: PRIMARY_COLOR,
                        opacity: isEditMode ? 0.7 : 1
                    }
                ]} 
                onPress={handleSelectMoviePress}
                activeOpacity={isEditMode ? 1 : 0.7}
            >
              <View style={styles.movieIconPlaceholder}>
                 <Ionicons name="film" size={24} color="#fff" />
              </View>
              <Text style={[styles.selectedMovieTitle, { color: theme.text }]}>{selectedMovie.title}</Text>
              
              {isEditMode 
                ? <Ionicons name="lock-closed" size={16} color={theme.subText} />
                : <Ionicons name="swap-horizontal" size={20} color={PRIMARY_COLOR} />
              }
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.selectButton} onPress={handleSelectMoviePress}>
              <Text style={styles.selectButtonText}>Sélectionner un film</Text>
              <Ionicons name="chevron-forward" size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        {/* stars */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.text }]}>Note</Text>
          <View style={[styles.starsContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Ionicons 
                    name={star <= rating ? "star" : "star-outline"} 
                    size={40} 
                    color="#FFD700" 
                    style={{ marginHorizontal: 5 }} 
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* avis */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.text }]}>Votre avis</Text>
          <TextInput
            style={[styles.textArea, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
            multiline={true}
            numberOfLines={5}
            value={comment} 
            onChangeText={setComment}
            placeholder="Qu'avez-vous pensé du film ?"
            placeholderTextColor={theme.subText}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isSubmitting}>
            {isSubmitting ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <Text style={styles.saveButtonText}>Sauvegarder</Text>
            )}
          </TouchableOpacity>
          
          {isEditMode && (
             <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} disabled={isSubmitting}>
                <Text style={styles.deleteButtonText}>Supprimer cet avis</Text>
             </TouchableOpacity>
          )}
        </View>
      </ScrollView>
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
      fontSize: 20, 
      fontWeight: 'bold', 
  },
  content: { padding: 20 },
  section: { marginBottom: 25 },
  label: { 
      fontSize: 16, 
      fontWeight: '600', 
      marginBottom: 10,
  },
  selectButton: { 
      backgroundColor: PRIMARY_COLOR, 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: 15, 
      borderRadius: 10, 
      shadowColor: "#000", 
      shadowOffset: { width: 0, height: 2 }, 
      shadowOpacity: 0.1, 
      shadowRadius: 4, 
      elevation: 3 
  },
  selectButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  selectedMovieCard: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      padding: 10, 
      borderRadius: 10, 
      borderWidth: 1, 
  },
  movieIconPlaceholder: { 
      width: 40, 
      height: 40, 
      borderRadius: 5, 
      backgroundColor: PRIMARY_COLOR, 
      justifyContent: 'center', 
      alignItems: 'center', 
      marginRight: 10 
  },
  selectedMovieTitle: { 
      flex: 1, 
      fontSize: 16, 
      fontWeight: 'bold', 
  },
  starsContainer: { 
      flexDirection: 'row', 
      justifyContent: 'center', 
      padding: 15, 
      borderRadius: 10, 
      borderWidth: 1, 
  },
  textArea: { 
      borderRadius: 10, 
      padding: 15, 
      borderWidth: 1, 
      minHeight: 120, 
      fontSize: 16, 
  },
  footer: { marginTop: 10 },
  saveButton: { 
      backgroundColor: PRIMARY_COLOR, 
      padding: 15, 
      borderRadius: 25, 
      alignItems: 'center', 
      marginBottom: 15, 
      shadowColor: "#000", 
      shadowOffset: { width: 0, height: 2 }, 
      shadowOpacity: 0.1, 
      shadowRadius: 4, 
      elevation: 2 
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  deleteButton: { 
      backgroundColor: 'transparent', 
      borderWidth: 2, 
      borderColor: DANGER_COLOR, 
      padding: 13, 
      borderRadius: 25, 
      alignItems: 'center' 
  },
  deleteButtonText: { color: DANGER_COLOR, fontSize: 16, fontWeight: 'bold' },
});