import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

export default function LoginScreen() {
  return (
    <SafeAreaProvider>
        <SafeAreaView style={styles.container}>

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Login</Text>
            </View>

            <TextInput style={styles.input} placeholder="Username" />
            <TextInput style={styles.input} placeholder="Password" secureTextEntry={true} />

            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, { marginTop: 30}]}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
        </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#f0d4b0ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
      marginBottom: 40,
  },
  headerTitle: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#4A6572',
  },
  input: {
    borderColor: 'darkgray',
    borderWidth: 2,
    marginBottom: 24,
    borderRadius: 4,
    height: 60,
    width: 250,
    paddingLeft: 8,
    paddingRight: 8,
  },
  button: {
    backgroundColor: '#f3ca89ff',
    padding: 16,
    margin: 16,
    borderRadius: 32,
    height: 60,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
    buttonText: {
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
  },

});
