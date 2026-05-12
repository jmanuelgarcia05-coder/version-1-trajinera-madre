import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground,
  Alert,
} from "react-native";

// --- BASE DE DATOS MAESTRA (11 EMBARCADEROS) ---

const EMBARCADEROS = [
  { id: '1', nombre: 'Nativitas', zona: 'Tradicional', hitos: ['Madreselva', 'Mercado'], tiempos: { a1: 5, a2: 4, a3: 1, a4: 4 } },
  { id: '2', nombre: 'Zacapa', zona: 'Tradicional', hitos: ['Manantiales', 'Arquitectura'], tiempos: { a1: 5, a2: 4, a3: 1, a4: 4 } },
  { id: '3', nombre: 'Las Flores', zona: 'Tradicional', hitos: ['Canal Floral', 'Viveros'], tiempos: { a1: 5, a2: 4, a3: 1, a4: 4 } },
  { id: '4', nombre: 'Caltongo', zona: 'Tradicional', hitos: ['Centro', 'Capilla San Juan'], tiempos: { a1: 6, a2: 5, a3: 2, a4: 5 } },
  { id: '5', nombre: 'Salitre', zona: 'Tradicional', hitos: ['Salitrera Colonial'], tiempos: { a1: 6, a2: 5, a3: 2, a4: 5 } },
  { id: '6', nombre: 'Cuemanco', zona: 'Ecológica', hitos: ['Vista Volcanes', 'Aves'], tiempos: { a1: 4, a2: 2, a3: 3, a4: 1 } },
  { id: '7', nombre: 'Fernando Celada', zona: 'Ecológica', hitos: ['Laguna del Toro'], tiempos: { a1: 6, a2: 4, a3: 2, a4: 3 } },
  { id: '8', nombre: 'Puente de Urrutia', zona: 'Ecológica', hitos: ['Refugio Aves', 'Naturaleza'], tiempos: { a1: 5, a2: 3, a3: 4, a4: 2 } },
  { id: '9', nombre: 'Nuevo Nativitas', zona: 'Tradicional', hitos: ['Andador Peatonal'], tiempos: { a1: 5, a2: 4, a3: 1, a4: 4 } },
  { id: '10', nombre: 'San Cristóbal', zona: 'Tradicional', hitos: ['Invernaderos Rosas'], tiempos: { a1: 6, a2: 5, a3: 1, a4: 5 } },
  { id: '11', nombre: 'Belem', zona: 'Tradicional', hitos: ['Zona Mariachis'], tiempos: { a1: 6, a2: 5, a3: 1, a4: 5 } },
];

const ATRACTIVOS = [
  { id: 'a1', nombre: 'Isla de las Muñecas', image: require('../../assets/images/isla_munecas.png'), zonas: ['Tradicional', 'Ecológica'], desc: 'Misterio y leyenda original.' },
  { id: 'a2', nombre: 'Ajolotario Premium', image: require('../../assets/images/ajolote.png'), zonas: ['Ecológica', 'Tradicional'], desc: 'Encuentro con el dios Xólotl.' },
  { id: 'a3', nombre: 'Ruta Tradicional', image: require('../../assets/images/tradicional.png'), zonas: ['Tradicional'], desc: 'Mariachi, comida y fiesta.' },
  { id: 'a4', nombre: 'Reserva Natural', image: require('../../assets/images/hero.png'), zonas: ['Ecológica'], desc: 'Silencio, aves y volcanes.' },
];

export default function ExplorarSplitScreen() {
  const router = useRouter();
  const [embId, setEmbId] = useState<string | null>(null);
  const [expId, setExpId] = useState<string | null>(null);

  const selectedEmb = EMBARCADEROS.find(e => e.id === embId);
  const selectedExp = ATRACTIVOS.find(a => a.id === expId);

  // CÁLCULO DINÁMICO DE TIEMPO
  const getTiempoReal = (aId: string) => {
    if (!selectedEmb) return 0;
    return (selectedEmb.tiempos as any)[aId] || 2;
  };

  const totalHrs = selectedExp ? getTiempoReal(selectedExp.id) : (selectedEmb ? 1 : 0);

  const isEmbCompatible = (embZone: string) => !selectedExp || selectedExp.zonas.includes(embZone);
  const isExpCompatible = (expZones: string[]) => !selectedEmb || expZones.includes(selectedEmb.zona);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Matriz de Navegación</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* EMBARCADEROS */}
        <Text style={styles.label}>1. PUNTO DE PARTIDA ({EMBARCADEROS.length} DISPONIBLES)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.embRow}>
          {EMBARCADEROS.map(e => (
            <TouchableOpacity 
              key={e.id} 
              style={[styles.embCard, embId === e.id && styles.embCardActive, !isEmbCompatible(e.zona) && { opacity: 0.3 }]}
              onPress={() => setEmbId(e.id === embId ? null : e.id)}
            >
              <Text style={[styles.embName, embId === e.id && { color: '#fff' }]}>{e.nombre}</Text>
              <Text style={styles.embZone}>{e.zona}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* EXPERIENCIAS CON TIEMPOS DINÁMICOS */}
        <Text style={styles.label}>2. EXPERIENCIA Y TIEMPO REAL</Text>
        <View style={styles.expGrid}>
          {ATRACTIVOS.map(a => {
            const compatible = isExpCompatible(a.zonas);
            const tiempoReal = getTiempoReal(a.id);
            return (
              <TouchableOpacity 
                key={a.id} 
                style={[styles.expCard, expId === a.id && styles.expCardActive, !compatible && { opacity: 0.3 }]}
                onPress={() => setExpId(a.id === expId ? null : a.id)}
              >
                <ImageBackground source={a.image} style={styles.expImg} imageStyle={{ borderRadius: 25 }}>
                  <View style={styles.expOverlay}>
                    <View>
                      <Text style={styles.expName}>{a.nombre}</Text>
                      <Text style={styles.expTime}>⏱️ {tiempoReal > 0 ? `${tiempoReal} Horas Reales` : 'Selecciona embarcadero'}</Text>
                    </View>
                    {expId === a.id && <View style={styles.check}><Text style={styles.checkText}>✓</Text></View>}
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* RESUMEN */}
        {selectedEmb && selectedExp && (
          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>CÁLCULO LOGÍSTICO FINAL</Text>
            <Text style={styles.summaryText}>
              Navegación desde <Text style={{color: '#F8D36B'}}>{selectedEmb.nombre}</Text> hacia <Text style={{color: '#F8D36B'}}>{selectedExp.nombre}</Text> toma un total de <Text style={{color: '#F8D36B'}}>{totalHrs} horas</Text> ida y vuelta.
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.footLab}>TOTAL RECORRIDO</Text>
          <Text style={styles.footVal}>{totalHrs} Horas</Text>
        </View>
        <TouchableOpacity 
          style={[styles.bookBtn, (!selectedEmb || !selectedExp) && { opacity: 0.5 }]}
          onPress={() => router.push({
            pathname: "/servicios",
            params: { baseTotal: totalHrs * 600, experiencia: selectedExp?.nombre }
          })}
        >
          <Text style={styles.bookText}>CONTINUAR ➔</Text>
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
  scroll: { paddingBottom: 150 },
  label: { color: '#F8D36B', fontSize: 10, fontWeight: '900', marginHorizontal: 25, marginTop: 25, marginBottom: 15, letterSpacing: 2 },
  embRow: { paddingLeft: 25 },
  embCard: { backgroundColor: '#111', padding: 18, borderRadius: 20, marginRight: 12, width: 140, borderWidth: 1, borderColor: '#222' },
  embCardActive: { borderColor: '#F8D36B', backgroundColor: '#181818' },
  embName: { color: '#666', fontWeight: '900', fontSize: 13 },
  embZone: { color: '#444', fontSize: 9, marginTop: 4 },
  expGrid: { paddingHorizontal: 25 },
  expCard: { height: 160, borderRadius: 25, marginBottom: 20, borderWidth: 2, borderColor: '#111' },
  expCardActive: { borderColor: '#F8D36B' },
  expImg: { width: '100%', height: '100%' },
  expOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 25, padding: 25, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'flex-end' },
  expName: { color: '#fff', fontSize: 20, fontWeight: '900' },
  expTime: { color: '#F8D36B', fontSize: 12, fontWeight: '800', marginTop: 4 },
  check: { backgroundColor: '#F8D36B', width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  checkText: { color: '#000', fontWeight: '900' },
  summaryBox: { marginHorizontal: 25, marginTop: 10, backgroundColor: '#080808', padding: 25, borderRadius: 25, borderWidth: 1, borderColor: '#222' },
  summaryTitle: { color: '#444', fontSize: 9, fontWeight: '900', marginBottom: 10 },
  summaryText: { color: '#fff', fontSize: 14, fontWeight: '700', lineHeight: 22 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#111', padding: 25, paddingBottom: 45, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#222' },
  footLab: { color: '#666', fontSize: 10, fontWeight: '900' },
  footVal: { color: '#fff', fontSize: 28, fontWeight: '900' },
  bookBtn: { backgroundColor: '#F8D36B', paddingHorizontal: 30, paddingVertical: 18, borderRadius: 20 },
  bookText: { color: '#000', fontWeight: '900', fontSize: 16 }
});
