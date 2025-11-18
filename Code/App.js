import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import feed_screen from './feed_screen';
import movieList_screen from './movieList_screen'
import myRatings_screen from './myRatings_screen'
import rateMovie_screen from './rateMovie_screen'
import settings_screen from './settings_screen'

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
