import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";

const CAPITANES = [
  { 
    id: 'c1', 
    nombre: 'Don Beto Santana', 
    exp: '42 años', 
    rating: 4.9, 
    idiomas: ['Español', 'Inglés Básico'], 
    especialidad: 'Leyendas y Aves',
    bio: 'Descendiente directo de los primeros chinamperos. Conoce cada rincón secreto de la laguna.',
    image: require('../../assets/images/maestro_remero.png')
  },
  { 
    id: 'c2', 
    nombre: 'Julián Galindo', 
    exp: '15 años', 
    rating: 4.8, 
    idiomas: ['Español', 'Inglés', 'Francés'], 
    especialidad: 'Historia Prehispánica',
    bio: 'Certificado por el INAH como guía cultural. Especialista en la historia del imperio Azteca.',
    image: require('../../assets/images/hero.png') 
  },
  { 
    id: 'c3', 
    nombre: 'Matias Xólotl', 
    exp: '28 años', 
    rating: 5.0, 
    idiomas: ['Español', 'Náhuatl'], 
    especialidad: 'Ecología y Ajolotes',
    bio: 'Guardián del santuario de ajolotes. Experto en la flora y fauna endémica de Xochimilco.',
    image: require('../../assets/images/ajolote.png')
  },
];

export default function CapitanesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleContinue = () => {
    if (!selectedId) return;
    router.push({
      pathname: "/servicios",
      params: { ...params, capitanId: selectedId }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Elige a tu Capitán</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.promo}>Nuestros capitanes son maestros certificados con décadas de tradición familiar.</Text>

        {CAPITANES.map(cap => (
          <TouchableOpacity 
            key={cap.id} 
            activeOpacity={0.9}
            style={[styles.capCard, selectedId === cap.id && styles.capCardActive]}
            onPress={() => setSelectedId(cap.id)}
          >
            <View style={styles.row}>
              <Image source={cap.image} style={styles.capImg} />
              <View style={styles.info}>
                <View style={styles.nameRow}>
                  <Text style={styles.name}>{cap.nombre}</Text>
                  <View style={styles.verifyBadge}><Text style={styles.verifyText}>✓</Text></View>
                </View>
                <Text style={styles.exp}>{cap.exp} de experiencia</Text>
                <View style={styles.ratingRow}>
                  <Text style={styles.rating}>⭐ {cap.rating}</Text>
                  <Text style={styles.lang}>🌐 {cap.idiomas.join(' • ')}</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.bioBox}>
              <Text style={styles.especialidad}>Expertiz: <Text style={{color: '#F8D36B'}}>{cap.especialidad}</Text></Text>
              <Text style={styles.bioText} numberOfLines={2}>{cap.bio}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.bookBtn, !selectedId && { opacity: 0.5 }]}
          disabled={!selectedId}
          onPress={handleContinue}
        >
          <Text style={styles.bookText}>SIGUIENTE: PERSONALIZAR ➔</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: { paddingTop: 60, paddingHorizontal: 25, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  back: { color: '#F8D36B', fontSize: 24, fontWeight: '900' },
  title: { color: '#fff', fontSize: 18, fontWeight: '900' },
  scroll: { padding: 25, paddingBottom: 150 },
  promo: { color: '#666', fontSize: 13, lineHeight: 20, marginBottom: 25 },
  capCard: { backgroundColor: '#080808', borderRadius: 30, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#111' },
  capCardActive: { borderColor: '#F8D36B', backgroundColor: '#111' },
  row: { flexDirection: 'row', alignItems: 'center' },
  capImg: { width: 80, height: 80, borderRadius: 25, backgroundColor: '#222' },
  info: { flex: 1, marginLeft: 20 },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  name: { color: '#fff', fontSize: 18, fontWeight: '900' },
  verifyBadge: { backgroundColor: '#F8D36B', width: 18, height: 18, borderRadius: 9, marginLeft: 8, justifyContent: 'center', alignItems: 'center' },
  verifyText: { color: '#000', fontSize: 10, fontWeight: '900' },
  exp: { color: '#F8D36B', fontSize: 11, fontWeight: '800', marginTop: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  rating: { color: '#fff', fontSize: 12, fontWeight: '700', marginRight: 15 },
  lang: { color: '#555', fontSize: 10, fontWeight: '700' },
  bioBox: { marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#111' },
  especialidad: { color: '#999', fontSize: 11, fontWeight: '900', marginBottom: 5, textTransform: 'uppercase' },
  bioText: { color: '#555', fontSize: 12, lineHeight: 18 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 25, paddingBottom: 45, backgroundColor: '#000' },
  bookBtn: { backgroundColor: '#F8D36B', height: 65, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  bookText: { color: '#000', fontWeight: '900', fontSize: 16 }
});
