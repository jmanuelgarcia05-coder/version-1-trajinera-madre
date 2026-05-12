import { View, Text, StyleSheet } from 'react-native';

export default function TripScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Viaje actual</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505', justifyContent: 'center', alignItems: 'center' },
  title: { color: '#fff', fontSize: 28, fontWeight: '800' },
});
