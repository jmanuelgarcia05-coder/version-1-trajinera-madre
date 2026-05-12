import { View, Text, StyleSheet } from 'react-native';

export default function ExperiencesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Experiencias</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505', justifyContent: 'center', alignItems: 'center' },
  title: { color: '#fff', fontSize: 28, fontWeight: '800' },
});
