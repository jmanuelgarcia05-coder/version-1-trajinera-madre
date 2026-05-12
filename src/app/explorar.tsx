import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";

// --- BASE DE DATOS MAESTRA CON HITOS DE RECORRIDO ---

const EMBARCADEROS = [
  { 
    id: '1', 
    nombre: 'Nuevo Nativitas', 
    zona: 'Tradicional', 
    hitos: ['Mercado Madreselva', 'Bosque de Nativitas', 'Canal de las Flores'],
    desc: 'El corazón comercial y más festivo.',
    history: 'Punto de partida histórico de los grandes cargadores de flores.' 
  },
  { 
    id: '2', 
    nombre: 'Zacapa', 
    zona: 'Tradicional', 
    hitos: ['Restaurante Manantiales', 'Arquitectura de Félix Candela', 'Zona de Viveros'],
    desc: 'Servicio premium y alta gastronomía.',
    history: 'Famoso por su icónico edificio con forma de flor de loto.' 
  },
  { 
    id: '6', 
    nombre: 'Cuemanco', 
    zona: 'Ecológica', 
    hitos: ['Vista a los Volcanes', 'Avistamiento de Garzas', 'Chinampa Demostrativa'],
    desc: 'Reserva natural y zona de silencio.',
    history: 'Inaugurado como símbolo de la conservación del sistema chinampero.' 
  },
  { 
    id: '4', 
    nombre: 'Caltongo', 
    zona: 'Tradicional', 
    hitos: ['Centro Histórico', 'Capilla de San Juan', 'Mercado local'],
    desc: 'Tradición pura desde el centro del pueblo.',
    history: 'Uno de los accesos más antiguos vinculados al comercio de hortalizas.' 
  },
  { 
    id: '7', 
    nombre: 'Fernando Celada', 
    zona: 'Ecológica', 
    hitos: ['Laguna del Toro', 'Murales de Xochimilco', 'Canal del Muerto'],
    desc: 'Ruta literaria y tranquila.',
    history: 'Nombrado en honor al poeta xochimilca Fernando Celada.' 
  },
  { 
    id: '8', 
    nombre: 'Puente de Urrutia', 
    zona: 'Ecológica', 
    hitos: ['Refugio de Aves', 'Canales Remotos', 'Paz Total'],
    desc: 'Lo más profundo y virgen de la reserva.',
    history: 'Zona recuperada para la preservación de fauna silvestre.' 
  },
  { 
    id: '5', 
    nombre: 'Salitre', 
    zona: 'Tradicional', 
    hitos: ['Antigua Salitrera', 'Canal Principal', 'Barrio El Rosario'],
    desc: 'Historia colonial a flor de agua.',
    history: 'Aquí se extraía salitre para la pólvora en la época de la colonia.' 
  },
  { 
    id: '3', 
    nombre: 'Las Flores', 
    zona: 'Tradicional', 
    hitos: ['Chinampas de Flores', 'Ruta de Eventos', 'Jardines Flotantes'],
    desc: 'Elegancia y color en cada curva.',
    history: 'Especializado en el transporte de flores finas para la ciudad.' 
  },
  { 
    id: '9', 
    nombre: 'Belem', 
    zona: 'Tradicional', 
    hitos: ['Templo San Bernardino', 'Zona de Mariachis', 'Canal de los Muertos'],
    desc: 'Cercano, rápido y muy tradicional.',
    history: 'Punto de conexión espiritual y festivo de los barrios bajos.' 
  },
  { 
    id: '10', 
    nombre: 'San Cristóbal', 
    zona: 'Tradicional', 
    hitos: ['Invernaderos de Rosas', 'Barrio de San Cristóbal', 'Productores locales'],
    desc: 'Ruta de los productores floricultores.',
    history: 'Fundado por familias que han cultivado chinampas por generaciones.' 
  },
  { 
    id: '11', 
    nombre: 'Nativitas', 
    zona: 'Tradicional', 
    hitos: ['Mercado de Artesanías', 'Andador Peatonal', 'Zona Gastronómica'],
    desc: 'El destino turístico número uno.',
    history: 'El primer embarcadero en formalizar los paseos turísticos en 1935.' 
  }
];

const ATRACTIVOS = [
  { id: 'a1', nombre: 'Isla de las Muñecas', tiempo: 5, image: require('../../assets/images/isla_munecas.png'), zonas: ['Tradicional', 'Ecológica'], desc: 'Leyenda y misterio en la Laguna de Teshuilo.' },
  { id: 'a2', nombre: 'Ajolotario Premium', tiempo: 4, image: require('../../assets/images/ajolote.png'), zonas: ['Ecológica', 'Tradicional'], desc: 'Encuentro con el dios Xólotl en su hábitat.' },
  { id: 'a3', nombre: 'Ruta Tradicional', tiempo: 2, image: require('../../assets/images/tradicional.png'), zonas: ['Tradicional'], desc: 'La fiesta clásica: mariachi, comida y tradición.' },
  { id: 'a4', nombre: 'Reserva Natural', tiempo: 3, image: require('../../assets/images/hero.png'), zonas: ['Ecológica'], desc: 'Silencio, aves y vistas imperdibles de los volcanes.' },
];

export default function ExplorarMaestroScreen() {
  const router = useRouter();
  const [embId, setEmbId] = useState<string | null>(null);
  const [seleccionados, setSeleccionados] = useState<string[]>([]);

  const selectedEmb = EMBARCADEROS.find(e => e.id === embId);

  const toggleAtractivo = (id: string) => {
    if (seleccionados.includes(id)) {
      setSeleccionados(seleccionados.filter(i => i !== id));
    } else {
      setSeleccionados([...seleccionados, id]);
    }
  };

  const calcularTiempo = () => {
    const selected = ATRACTIVOS.filter(a => seleccionados.includes(a.id));
    if (selected.length === 0) return 0;
    return Math.max(...selected.map(a => a.tiempo));
  };

  const totalHrs = calcularTiempo();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Motor de Rutas Maestro</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* PASO 1: EMBARCADEROS */}
        <Text style={styles.label}>1. ELIGE TU EMBARCADERO</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.embRow}>
          {EMBARCADEROS.map(e => (
            <TouchableOpacity 
              key={e.id} 
              style={[styles.embCard, embId === e.id && styles.embCardActive]}
              onPress={() => { setEmbId(e.id); setSeleccionados([]); }}
            >
              <Text style={[styles.embName, embId === e.id && styles.embNameActive]}>{e.nombre}</Text>
              <Text style={styles.embZone}>{e.zona}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* INFO DEL EMBARCADERO SELECCIONADO + HITOS */}
        {selectedEmb && (
          <View style={styles.infoBox}>
            <View style={styles.infoHeader}>
              <Text style={styles.infoTitle}>PUNTOS CLAVE EN EL RECORRIDO:</Text>
              <View style={styles.hitosGrid}>
                {selectedEmb.hitos.map((h, i) => (
                  <View key={i} style={styles.hitoBadge}>
                    <Text style={styles.hitoText}>📍 {h}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.divider} />
            <Text style={styles.infoHistory}>{selectedEmb.history}</Text>
          </View>
        )}

        {/* PASO 2: ATRACTIVOS */}
        {selectedEmb && (
          <>
            <Text style={styles.label}>2. DESTINO PRINCIPAL DEL VIAJE</Text>
            {ATRACTIVOS.filter(a => a.zonas.includes(selectedEmb.zona)).map(a => (
              <TouchableOpacity 
                key={a.id} 
                style={[styles.atractivoCard, seleccionados.includes(a.id) && styles.atractivoActive]}
                onPress={() => toggleAtractivo(a.id)}
              >
                <Image source={a.image} style={styles.atractivoImg} />
                <View style={styles.atractivoOverlay}>
                  <View>
                    <Text style={styles.atractivoName}>{a.nombre}</Text>
                    <Text style={styles.atractivoTime}>⏱️ {a.tiempo} Horas Reales</Text>
                  </View>
                  {seleccionados.includes(a.id) && <View style={styles.check}><Text style={styles.checkText}>✓</Text></View>}
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>

      {/* FOOTER MAESTRO */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.footLab}>DURACIÓN TOTAL SUGERIDA</Text>
          <Text style={styles.footVal}>{totalHrs} Horas</Text>
        </View>
        <TouchableOpacity 
          style={[styles.bookBtn, totalHrs === 0 && { opacity: 0.5 }]}
          disabled={totalHrs === 0}
          onPress={() => Alert.alert("Plan de Viaje", "Has configurado una ruta de " + totalHrs + " horas.")}
        >
          <Text style={styles.bookText}>PLANEAR RUTA</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: { paddingTop: 60, paddingHorizontal: 25, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  back: { color: '#F8D36B', fontSize: 24, fontWeight: '900' },
  title: { color: '#fff', fontSize: 18, fontWeight: '900', letterSpacing: 1 },
  scroll: { paddingBottom: 150 },
  label: { color: '#F8D36B', fontSize: 11, fontWeight: '900', marginHorizontal: 25, marginTop: 25, marginBottom: 15, letterSpacing: 2 },
  embRow: { paddingLeft: 25 },
  embCard: { backgroundColor: '#111', padding: 20, borderRadius: 25, marginRight: 15, width: 180, borderWidth: 1, borderColor: '#222' },
  embCardActive: { borderColor: '#F8D36B', backgroundColor: '#181818' },
  embName: { color: '#666', fontWeight: '900', fontSize: 14 },
  embNameActive: { color: '#fff' },
  embZone: { color: '#F8D36B', fontSize: 10, fontWeight: '800', marginTop: 5 },
  infoBox: { marginHorizontal: 25, marginTop: 20, backgroundColor: '#080808', padding: 25, borderRadius: 25, borderWidth: 1, borderColor: '#222' },
  infoTitle: { color: '#666', fontSize: 10, fontWeight: '900', marginBottom: 15, letterSpacing: 1 },
  hitosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  hitoBadge: { backgroundColor: '#111', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: '#222' },
  hitoText: { color: '#F8D36B', fontSize: 11, fontWeight: '800' },
  divider: { height: 1, backgroundColor: '#111', marginVertical: 20 },
  infoHistory: { color: '#fff', fontSize: 12, lineHeight: 20, fontStyle: 'italic', color: '#888' },
  atractivoCard: { marginHorizontal: 25, height: 160, borderRadius: 25, overflow: 'hidden', marginBottom: 20, borderWidth: 2, borderColor: '#111' },
  atractivoActive: { borderColor: '#F8D36B' },
  atractivoImg: { width: '100%', height: '100%', opacity: 0.6 },
  atractivoOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)', padding: 25, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'flex-end' },
  atractivoName: { color: '#fff', fontSize: 20, fontWeight: '900' },
  atractivoTime: { color: '#F8D36B', fontSize: 12, fontWeight: '800', marginTop: 4 },
  check: { backgroundColor: '#F8D36B', width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  checkText: { color: '#000', fontWeight: '900' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#111', padding: 25, paddingBottom: 45, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#222' },
  footLab: { color: '#666', fontSize: 10, fontWeight: '900' },
  footVal: { color: '#fff', fontSize: 28, fontWeight: '900' },
  bookBtn: { backgroundColor: '#F8D36B', paddingHorizontal: 30, paddingVertical: 18, borderRadius: 20 },
  bookText: { color: '#000', fontWeight: '900', fontSize: 16 }
});
