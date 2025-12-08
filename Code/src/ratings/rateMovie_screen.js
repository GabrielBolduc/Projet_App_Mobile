import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { executeQuery } from '../services/api';
import { useAuth } from '../context/authContext';

const PRIMARY_COLOR = '#4A6572';
const DANGER_COLOR = '#D32F2F';

export default function RateMovieScreen({ navigation, route }) {
  const { user } = useAuth();
  const existingItem = route.params?.item;
  const isEditMode = !!existingItem;

  const [selectedMovie, setSelectedMovie] = useState(
    existingItem ? { id: existingItem.movie_id, title: existingItem.movie_title } : null
  );
  const [rating, setRating] = useState(existingItem ? existingItem.rating : 0);
  const [comment, setComment] = useState(existingItem ? existingItem.comment : '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mise à jour quand on revient de la liste de films
  useEffect(() => {
    if (route.params?.selection) {
      setSelectedMovie({
        id: route.params.selection.id,
        title: route.params.selection.title
      });
    }
  }, [route.params?.selection]);

  const handleSelectMoviePress = () => {
    if (!isEditMode) {
        // On navigue vers la liste pour choisir un film
        navigation.navigate('MovieList');
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
            // Mode UPDATE
            result = await executeQuery('update_rating', {
                rating: rating,
                comment: comment,
                id: existingItem.id,
                user_id: user.id
            });
        } else {
            // Mode CREATE
            result = await executeQuery('create_rating', {
                user_id: user.id,
                movie_id: selectedMovie.id,
                rating: rating,
                comment: comment
            });
        }

        if (result.success) {
            // CORRECTION ICI : Redirection forcée vers l'écran "Mes ratings"
            // Cela évite de retourner sur la liste des films si la pile de navigation est complexe.
            navigation.navigate('Mes ratings'); 
        } else {
            Alert.alert("Erreur", "Impossible de sauvegarder. Vérifiez si vous n'avez pas déjà noté ce film.");
        }
    } catch (e) {
        console.error(e);
        Alert.alert("Erreur", "Erreur de connexion.");
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
             // Même chose pour la suppression, on retourne proprement à la liste des ratings
             navigation.navigate('Mes ratings');
          } else {
             Alert.alert("Erreur", "Impossible de supprimer.");
          }
      }}
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={PRIMARY_COLOR} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditMode ? "Modifier l'avis" : "Ajouter un avis"}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Sélection Film */}
        <View style={styles.section}>
          {selectedMovie ? (
            <TouchableOpacity style={[styles.selectedMovieCard, isEditMode && {opacity: 0.7}]} onPress={handleSelectMoviePress} disabled={isEditMode}>
              <View style={styles.movieIconPlaceholder}>
                 <Ionicons name="film" size={24} color="#fff" />
              </View>
              <Text style={styles.selectedMovieTitle}>{selectedMovie.title}</Text>
              {!isEditMode && <Ionicons name="swap-horizontal" size={20} color={PRIMARY_COLOR} />}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.selectButton} onPress={handleSelectMoviePress}>
              <Text style={styles.selectButtonText}>Sélectionner un film</Text>
              <Ionicons name="chevron-forward" size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        {/* Étoiles */}
        <View style={styles.section}>
          <Text style={styles.label}>Note</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Ionicons name={star <= rating ? "star" : "star-outline"} size={40} color="#FFD700" style={{ marginHorizontal: 5 }} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Commentaire */}
        <View style={styles.section}>
          <Text style={styles.label}>Avis</Text>
          <TextInput
            style={styles.textArea}
            multiline numberOfLines={5}
            value={comment} onChangeText={setComment}
            placeholder="Votre avis..."
            textAlignVertical="top"
          />
        </View>

        {/* Boutons */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isSubmitting}>
            {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Sauvegarder</Text>}
          </TouchableOpacity>
          {isEditMode && (
             <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} disabled={isSubmitting}>
                <Text style={styles.deleteButtonText}>Supprimer</Text>
             </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: PRIMARY_COLOR },
  content: { padding: 20 },
  section: { marginBottom: 25 },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 10 },
  selectButton: { backgroundColor: PRIMARY_COLOR, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderRadius: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  selectButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  selectedMovieCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 10, borderRadius: 10, borderWidth: 1, borderColor: PRIMARY_COLOR },
  movieIconPlaceholder: { width: 40, height: 40, borderRadius: 5, backgroundColor: PRIMARY_COLOR, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  selectedMovieTitle: { flex: 1, fontSize: 16, fontWeight: 'bold', color: '#333' },
  starsContainer: { flexDirection: 'row', justifyContent: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#E0E0E0' },
  textArea: { backgroundColor: '#fff', borderRadius: 10, padding: 15, borderWidth: 1, borderColor: '#E0E0E0', minHeight: 120, fontSize: 16, color: '#333' },
  footer: { marginTop: 10 },
  saveButton: { backgroundColor: PRIMARY_COLOR, padding: 15, borderRadius: 25, alignItems: 'center', marginBottom: 15 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  deleteButton: { backgroundColor: 'transparent', borderWidth: 2, borderColor: DANGER_COLOR, padding: 13, borderRadius: 25, alignItems: 'center' },
  deleteButtonText: { color: DANGER_COLOR, fontSize: 16, fontWeight: 'bold' },
});