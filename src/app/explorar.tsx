import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Dimensions,
  Alert,
} from "react-native";

const { width } = Dimensions.get("window");

const EMBARCADEROS = [
  { id: '1', nombre: 'Nuevo Nativitas', zona: 'Tradicional', history: 'Punto más vibrante y comercial.', tiempos: { a1: 5, a2: 4, a3: 1, a4: 4 } },
  { id: '2', nombre: 'Zacapa', zona: 'Tradicional', history: 'Belleza arquitectónica única.', tiempos: { a1: 5, a2: 4, a3: 1, a4: 4 } },
  { id: '6', nombre: 'Cuemanco', zona: 'Ecológica', history: 'Naturaleza y paz absoluta.', tiempos: { a1: 4, a2: 2, a3: 3, a4: 1 } },
  { id: '4', nombre: 'Caltongo', zona: 'Tradicional', history: 'Tradición en el corazón de Xochimilco.', tiempos: { a1: 6, a2: 5, a3: 2, a4: 5 } },
  { id: '7', nombre: 'Fernando Celada', zona: 'Ecológica', history: 'Entrada norte a los canales.', tiempos: { a1: 6, a2: 4, a3: 2, a4: 3 } },
  { id: '3', nombre: 'Las Flores', zona: 'Tradicional', history: 'Canales llenos de color floral.', tiempos: { a1: 5, a2: 4, a3: 1, a4: 4 } },
  { id: '5', nombre: 'Salitre', zona: 'Tradicional', history: 'Ruta histórica y legendaria.', tiempos: { a1: 6, a2: 5, a3: 2, a4: 5 } },
  { id: '8', nombre: 'Puente de Urrutia', zona: 'Ecológica', history: 'Avistamiento de aves migratorias.', tiempos: { a1: 5, a2: 3, a3: 4, a4: 2 } },
  { id: '9', nombre: 'Belem de las Flores', zona: 'Tradicional', history: 'Ruta de gran belleza mística.', tiempos: { a1: 6, a2: 5, a3: 1, a4: 5 } },
  { id: '10', nombre: 'San Cristóbal', zona: 'Tradicional', history: 'Tradición chinampera viva.', tiempos: { a1: 6, a2: 5, a3: 1, a4: 5 } },
  { id: '11', nombre: 'Belem', zona: 'Tradicional', history: 'El alma de la fiesta mexicana.', tiempos: { a1: 6, a2: 5, a3: 1, a4: 5 } },
];

const ATRACTIVOS = [
  { id: 'a1', nombre: 'Isla de las Muñecas', image: require('../../assets/images/isla_munecas.png'), zonas: ['Tradicional', 'Ecológica'], desc: 'Misterio y leyendas en el corazón de Xochimilco.' },
  { id: 'a2', nombre: 'Ajolotario Premium', image: require('../../assets/images/ajolote.png'), zonas: ['Ecológica', 'Tradicional'], desc: 'Un encuentro mágico con el guardián del agua.' },
  { id: 'a3', nombre: 'Ruta Tradicional', image: require('../../assets/images/tradicional.png'), zonas: ['Tradicional'], desc: 'Mariachi, tequila y el mejor ambiente mexicano.' },
  { id: 'a4', nombre: 'Reserva Ecológica', image: require('../../assets/images/hero.png'), zonas: ['Ecológica'], desc: 'Paz absoluta, aves exóticas y vista a volcanes.' },
];

export default function ExplorarUltraScreen() {
  const router = useRouter();
  const [embId, setEmbId] = useState<string | null>(null);
  const [expId, setExpId] = useState<string | null>(null);

  const selectedEmb = EMBARCADEROS.find(e => e.id === embId);
  const selectedExp = ATRACTIVOS.find(a => a.id === expId);

  const getTiempoReal = (aId: string) => (selectedEmb?.tiempos as any)?.[aId] || 2;
  const compatibleExp = (zones: string[]) => !selectedEmb || zones.includes(selectedEmb.zona);
  const compatibleEmb = (zone: string) => !selectedExp || selectedExp.zonas.includes(zone);

  const tiempoTotal = selectedExp ? getTiempoReal(selectedExp.id) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backCircle}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>XOCHIMILCO</Text>
          <Text style={styles.headerSubtitle}>PLANIFICADOR MAESTRO</Text>
        </View>
        <View style={{ width: 45 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* SECCIÓN 1: EMBARCADEROS (CARRUSEL PREMIUM) */}
        <Text style={styles.sectionLabel}>PUNTO DE EMBARQUE</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.embContainer}>
          {EMBARCADEROS.map(e => {
            const compatible = compatibleEmb(e.zona);
            const active = embId === e.id;
            return (
              <TouchableOpacity 
                key={e.id} 
                activeOpacity={0.8}
                style={[styles.embCard, active && styles.embCardActive, !compatible && { opacity: 0.3 }]}
                onPress={() => setEmbId(active ? null : e.id)}
              >
                <Text style={[styles.embName, active && { color: '#F8D36B' }]}>{e.nombre}</Text>
                <View style={[styles.zoneBadge, { backgroundColor: e.zona === 'Ecológica' ? '#064e3b' : '#451a03' }]}>
                  <Text style={styles.zoneText}>{e.zona.toUpperCase()}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* SECCIÓN 2: EXPERIENCIAS (FOTOS GIGANTES CINEMÁTICAS) */}
        <Text style={styles.sectionLabel}>EXPERIENCIAS DISPONIBLES</Text>
        <View style={styles.expGrid}>
          {ATRACTIVOS.map(a => {
            const compatible = compatibleExp(a.zonas);
            const active = expId === a.id;
            const tiempo = getTiempoReal(a.id);
            return (
              <TouchableOpacity 
                key={a.id} 
                activeOpacity={0.9}
                style={[styles.expCard, active && styles.expCardActive, !compatible && { opacity: 0.2 }]}
                onPress={() => setExpId(active ? null : a.id)}
              >
                <ImageBackground source={a.image} style={styles.expBg} imageStyle={{ borderRadius: 30 }}>
                  <View style={styles.expOverlay}>
                    <View style={styles.expTop}>
                      {active && <View style={styles.activeIndicator}><Text style={styles.activeText}>SELECCIONADO</Text></View>}
                    </View>
                    <View style={styles.expInfo}>
                      <Text style={styles.expTitle}>{a.nombre}</Text>
                      <View style={styles.timeRow}>
                        <Text style={styles.timeVal}>⏱️ {tiempo} HORAS</Text>
                        <Text style={styles.timeDot}> • </Text>
                        <Text style={styles.timeLabel}>TIEMPO REAL</Text>
                      </View>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* RESUMEN LOGÍSTICO */}
        {selectedEmb && selectedExp && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>ITINERARIO CONFIRMADO</Text>
            <Text style={styles.summaryMain}>
              Partida desde <Text style={styles.goldText}>{selectedEmb.nombre}</Text> hacia <Text style={styles.goldText}>{selectedExp.nombre}</Text>.
            </Text>
            <Text style={styles.summaryHistory}>"{selectedEmb.history}"</Text>
          </View>
        )}
      </ScrollView>

      {/* FOOTER PREMIUM */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.footLabel}>TOTAL NAVEGACIÓN</Text>
          <Text style={styles.footVal}>{tiempoTotal} Horas</Text>
        </View>
        <TouchableOpacity 
          style={[styles.bookBtn, (!selectedEmb || !selectedExp) && { opacity: 0.5 }]}
          disabled={!selectedEmb || !selectedExp}
          onPress={() => router.push({
            pathname: "/capitanes",
            params: { baseTotal: tiempoTotal * 600, experiencia: selectedExp?.nombre }
          })}
        >
          <Text style={styles.bookText}>SIGUIENTE ➔</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: { paddingTop: 60, paddingHorizontal: 25, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  backCircle: { width: 45, height: 45, borderRadius: 23, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#222' },
  backArrow: { color: '#F8D36B', fontSize: 20, fontWeight: '900' },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '900', letterSpacing: 2, textAlign: 'center' },
  headerSubtitle: { color: '#F8D36B', fontSize: 9, fontWeight: '900', letterSpacing: 3, textAlign: 'center', marginTop: 2 },
  scroll: { paddingBottom: 150 },
  sectionLabel: { color: '#444', fontSize: 10, fontWeight: '900', marginHorizontal: 25, marginTop: 35, marginBottom: 20, letterSpacing: 3 },
  embContainer: { paddingLeft: 25 },
  embCard: { backgroundColor: '#080808', width: 180, padding: 22, borderRadius: 30, marginRight: 15, borderWidth: 1, borderColor: '#151515', shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.5, shadowRadius: 10 },
  embCardActive: { borderColor: '#F8D36B', backgroundColor: '#111' },
  embName: { color: '#fff', fontSize: 15, fontWeight: '900' },
  zoneBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, alignSelf: 'flex-start', marginTop: 10 },
  zoneText: { color: '#fff', fontSize: 8, fontWeight: '900' },
  expGrid: { paddingHorizontal: 25 },
  expCard: { height: 220, borderRadius: 35, marginBottom: 25, borderWidth: 2, borderColor: '#000' },
  expCardActive: { borderColor: '#F8D36B' },
  expBg: { width: '100%', height: '100%' },
  expOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 30, padding: 30, justifyContent: 'space-between' },
  expTop: { flexDirection: 'row', justifyContent: 'flex-end' },
  activeIndicator: { backgroundColor: '#F8D36B', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  activeText: { color: '#000', fontSize: 10, fontWeight: '900' },
  expInfo: { },
  expTitle: { color: '#fff', fontSize: 26, fontWeight: '900', textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 10 },
  timeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  timeVal: { color: '#F8D36B', fontSize: 12, fontWeight: '900' },
  timeDot: { color: '#fff', fontSize: 12 },
  timeLabel: { color: '#fff', fontSize: 10, fontWeight: '700', opacity: 0.8 },
  summaryCard: { marginHorizontal: 25, marginTop: 10, backgroundColor: '#080808', padding: 30, borderRadius: 35, borderWidth: 1, borderColor: '#151515' },
  summaryTitle: { color: '#444', fontSize: 10, fontWeight: '900', letterSpacing: 2, marginBottom: 15 },
  summaryMain: { color: '#fff', fontSize: 16, fontWeight: '700', lineHeight: 24 },
  goldText: { color: '#F8D36B' },
  summaryHistory: { color: '#555', fontSize: 12, fontStyle: 'italic', marginTop: 15, lineHeight: 18 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#050505', padding: 25, paddingBottom: 45, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#111' },
  footLabel: { color: '#444', fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  footVal: { color: '#fff', fontSize: 32, fontWeight: '900' },
  bookBtn: { backgroundColor: '#F8D36B', paddingHorizontal: 35, paddingVertical: 20, borderRadius: 22, shadowColor: '#F8D36B', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 15 },
  bookText: { color: '#000', fontWeight: '900', fontSize: 16 }
});
