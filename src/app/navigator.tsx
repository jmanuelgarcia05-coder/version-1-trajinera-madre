import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import * as Speech from 'expo-speech';

const HISTORIAS = [
  { 
    id: 1, 
    titulo: "El Origen de las Chinampas", 
    historia: "Las chinampas no son islas flotantes. Son un sistema agrícola prehispánico de raíces profundas que alimentó a todo el imperio Azteca. Es un orgullo de la ingeniería mexicana que aún hoy funciona perfectamente.", 
    image: require('../../assets/images/hero.png'),
    emoji: "🌽" 
  },
  { 
    id: 2, 
    titulo: "La Isla de las Muñecas", 
    historia: "Don Julián Santana empezó a colgar muñecas para ahuyentar el espíritu de una joven. Hoy es el lugar más místico y visitado de todos los canales de Xochimilco.", 
    image: require('../../assets/images/isla_munecas.png'),
    emoji: "👻" 
  },
  { 
    id: 3, 
    titulo: "El Sagrado Ajolote", 
    historia: "El Ajolote era el dios Xólotl, quien se transformó en este animal para evitar ser sacrificado. Es una criatura sagrada y única en el mundo que solo vive aquí.", 
    image: require('../../assets/images/ajolote.png'),
    emoji: "🧬" 
  },
];

export default function NavigatorScreen() {
  const router = useRouter();
  const [progreso, setProgreso] = useState(0);
  const [historiaActiva, setHistoriaActiva] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgreso(p => (p < 100 ? p + 2 : 0));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const hablarHistoria = (texto: string) => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      Speech.speak(texto, {
        language: 'es-MX',
        onDone: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
        pitch: 1.0,
        rate: 0.85,
      });
    }
  };

  useEffect(() => {
    return () => Speech.stop();
  }, []);

  return (
    <View style={styles.container}>
      {/* MAPA PREMIUM */}
      <View style={styles.mapHeader}>
        <Image 
          source={{ uri: 'https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/-99.10,19.25,13/500x500?access_token=YOUR_TOKEN' }} 
          style={styles.mapImg}
        />
        <View style={styles.mapOverlay}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>
          <View style={styles.liveBadge}>
            <View style={styles.dot} />
            <Text style={styles.liveText}>VIAJE EN CURSO</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* BARRA DE PROGRESO */}
        <View style={styles.navCard}>
          <View style={styles.navRow}>
            <Text style={styles.navLabel}>Progreso de la Ruta</Text>
            <Text style={styles.navPercent}>{progreso}%</Text>
          </View>
          <View style={styles.barBg}>
            <View style={[styles.barFill, { width: `${progreso}%` }]} />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Guía Audiovisual Premium</Text>

        {HISTORIAS.map((h, i) => (
          <View key={h.id} style={[styles.storyCard, historiaActiva === i && styles.storyActive]}>
            <TouchableOpacity onPress={() => { setHistoriaActiva(i); Speech.stop(); setIsSpeaking(false); }}>
              <ImageBackground source={h.image} style={styles.storyImg} imageStyle={{ borderRadius: 20 }}>
                <View style={styles.storyOverlay}>
                  <Text style={styles.storyTitle}>{h.titulo}</Text>
                  <Text style={styles.storySubtitle}>Toca para explorar</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>

            {historiaActiva === i && (
              <View style={styles.expandedContent}>
                <Text style={styles.fullText}>{h.historia}</Text>
                <TouchableOpacity 
                  style={[styles.audioBtn, isSpeaking && { backgroundColor: '#ff4444' }]} 
                  onPress={() => hablarHistoria(h.historia)}
                >
                  <Text style={styles.audioBtnText}>
                    {isSpeaking ? "⏹ DETENER NARRACIÓN" : "🔊 ESCUCHAR HISTORIA"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* SOS EMERGENCIA */}
      <TouchableOpacity style={styles.sosBtn} onPress={() => Alert.alert("Emergencia", "Enviando ubicación a patrulla fluvial...")}>
        <Text style={styles.sosText}>🆘 SOS</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  mapHeader: { height: 280, backgroundColor: '#050505' },
  mapImg: { width: '100%', height: '100%', opacity: 0.3 },
  mapOverlay: { ...StyleSheet.absoluteFillObject, padding: 30, paddingTop: 60, justifyContent: 'space-between' },
  closeBtn: { backgroundColor: 'rgba(255,255,255,0.1)', width: 45, height: 45, borderRadius: 25, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  closeText: { color: '#fff', fontSize: 24, fontWeight: '200' },
  liveBadge: { backgroundColor: 'rgba(0,0,0,0.8)', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#F8D36B' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#F8D36B', marginRight: 8 },
  liveText: { color: '#F8D36B', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  scroll: { padding: 25, paddingBottom: 150 },
  navCard: { backgroundColor: '#080808', padding: 25, borderRadius: 25, marginBottom: 35, borderWidth: 1, borderColor: '#111' },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  navLabel: { color: '#666', fontSize: 12, fontWeight: '900' },
  navPercent: { color: '#F8D36B', fontSize: 16, fontWeight: '900' },
  barBg: { height: 4, backgroundColor: '#111', borderRadius: 2, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: '#F8D36B' },
  sectionTitle: { color: '#fff', fontSize: 20, fontWeight: '900', marginBottom: 25, letterSpacing: 0.5 },
  storyCard: { backgroundColor: '#080808', borderRadius: 25, marginBottom: 20, borderWidth: 1, borderColor: '#111', overflow: 'hidden' },
  storyActive: { borderColor: '#F8D36B' },
  storyImg: { width: '100%', height: 160 },
  storyOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', padding: 25, justifyContent: 'flex-end' },
  storyTitle: { color: '#fff', fontSize: 22, fontWeight: '900' },
  storySubtitle: { color: '#F8D36B', fontSize: 10, fontWeight: '800', marginTop: 5, letterSpacing: 1 },
  expandedContent: { padding: 25, backgroundColor: '#080808' },
  fullText: { color: '#bbb', fontSize: 15, lineHeight: 24, fontWeight: '500' },
  audioBtn: { marginTop: 25, backgroundColor: '#F8D36B', padding: 20, borderRadius: 20, alignItems: 'center', shadowColor: '#F8D36B', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, shadowRadius: 10 },
  audioBtnText: { color: '#000', fontWeight: '900', fontSize: 14, letterSpacing: 1 },
  sosBtn: { position: 'absolute', bottom: 40, right: 25, backgroundColor: '#f00', paddingHorizontal: 25, paddingVertical: 18, borderRadius: 35, shadowColor: '#f00', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 15 },
  sosText: { color: '#fff', fontWeight: '900', fontSize: 16 }
});
