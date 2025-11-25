import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY_COLOR = '#4A6572';
const DANGER_COLOR = '#D32F2F';

export default function RateMovieScreen({ navigation, route }) {
  // 1. Récupération des paramètres (si on vient du mode Edit)
  const existingItem = route.params?.item;
  const isEditMode = !!existingItem;

  useEffect(() => {
    if (route.params?.selection) {
      // Si on revient de la liste avec une "selection"
      setSelectedMovie({
        id: route.params.selection.id,
        title: route.params.selection.title
      });
    }
  }, [route.params?.selection]);

  // 2. États locaux (State)
  // Si mode edit, on pré-remplit, sinon vide
  const [selectedMovie, setSelectedMovie] = useState(
    existingItem ? { id: existingItem.movie_id, title: existingItem.movie_title } : null
  );
  const [rating, setRating] = useState(existingItem ? existingItem.rating : 0);
  const [comment, setComment] = useState(existingItem ? existingItem.comment : '');

  // Fonction pour gérer le clic sur une étoile
  const handleStarPress = (starValue) => {
    setRating(starValue);
  };

  // Fonction simulant la navigation vers l'écran "Liste Film"
  const handleSelectMoviePress = () => {
    navigation.navigate('MovieList')
  };

  const handleSave = () => {
    if (!selectedMovie || rating === 0) {
      Alert.alert("Erreur", "Veuillez sélectionner un film et donner une note.");
      return;
    }
    // Ici : Appel API SQL (INSERT ou UPDATE dans la table Ratings)
    console.log("Sauvegarde :", {
      mode: isEditMode ? 'UPDATE' : 'INSERT',
      movie_id: selectedMovie.id,
      rating: rating,
      comment: comment
    });
    navigation.goBack();
  };


  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.header}>
        {/* Bouton Retour */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={PRIMARY_COLOR} />
        </TouchableOpacity>

        {/* Titre */}
        <Text style={styles.headerTitle}>
          {isEditMode ? "Modifier l'avis" : "Ajouter rating"}
        </Text>

        {/* Vue vide invisible pour centrer le titre */}
        <View style={{ width: 24 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        {/* SECTION 1 : SÉLECTION DU FILM */}
        <View style={styles.section}>
          {selectedMovie ? (
            // Si un film est choisi
            <TouchableOpacity style={styles.selectedMovieCard} onPress={handleSelectMoviePress}>
              <View style={styles.movieIconPlaceholder}>
                 <Ionicons name="film" size={24} color="#fff" />
              </View>
              <Text style={styles.selectedMovieTitle}>{selectedMovie.title}</Text>
              <Ionicons name="swap-horizontal" size={20} color={PRIMARY_COLOR} />
            </TouchableOpacity>
          ) : (
            // Si aucun film n'est choisi (Bouton de la maquette)
            <TouchableOpacity style={styles.selectButton} onPress={handleSelectMoviePress}>
              <Text style={styles.selectButtonText}>Sélectionner un film</Text>
              <Ionicons name="chevron-forward" size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        {/* SECTION 2 : NOTE (ÉTOILES) */}
        <View style={styles.section}>
          <Text style={styles.label}>Note finale</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => handleStarPress(star)}>
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

        {/* SECTION 3 : AVIS (TEXTE) */}
        <View style={styles.section}>
          <Text style={styles.label}>Donne ton avis</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Qu'avez-vous pensé de ce film ?"
            placeholderTextColor="#aaa"
            multiline={true}
            numberOfLines={5}
            value={comment}
            onChangeText={setComment}
            textAlignVertical="top" // Important pour Android
          />
        </View>

        {/* BOUTONS D'ACTION */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Sauvegarder</Text>
          </TouchableOpacity>
          
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  // Style bouton sélection film
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
    elevation: 3,
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Style carte film sélectionné
  selectedMovieCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
  },
  movieIconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 5,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  selectedMovieTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  // Style Etoiles
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  // Style Zone de texte
  textArea: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minHeight: 120,
    fontSize: 16,
    color: '#333',
  },
  // Footer Boutons
  footer: {
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: PRIMARY_COLOR,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: DANGER_COLOR,
    padding: 13,
    borderRadius: 25,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: DANGER_COLOR,
    fontSize: 16,
    fontWeight: 'bold',
  },
});