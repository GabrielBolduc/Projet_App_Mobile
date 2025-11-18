import { StyleSheet, Text, View } from "react-native";

export default function rateMovie() {
    return (
        <View style={styles.container}>
            <Text>rateMovie screen</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
  },
})