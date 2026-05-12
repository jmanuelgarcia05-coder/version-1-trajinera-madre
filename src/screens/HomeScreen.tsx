import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>TrajinerApp</Text>
      <Text style={styles.subtitle}>Explora Xochimilco</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505', justifyContent: 'center', alignItems: 'center' },
  title: { color: '#00ff88', fontSize: 36, fontWeight: '900' },
  subtitle: { color: '#fff', marginTop: 10, fontSize: 18 },
});
