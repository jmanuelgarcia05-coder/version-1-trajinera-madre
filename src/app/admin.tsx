import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  Dimensions,
} from "react-native";
import { supabase } from "../lib/supabase";

const { width } = Dimensions.get("window");

export default function AdminCommandCenter() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [stats, setStats] = useState({
    revenue: 12500,
    active: 8,
    sos: 0,
    online: 12
  });

  const [flota, setFlota] = useState([
    { id: 1, name: "Trajinera 'La Flor'", cap: "Don Beto", status: "En curso", pos: 45 },
    { id: 2, name: "Lujo Xochimilca", cap: "Julián G.", status: "Embarcando", pos: 10 },
    { id: 3, name: "Aventura Real", cap: "Matias X.", status: "SOS", pos: 80 },
  ]);

  useEffect(() => {
    // Simulación de carga de datos reales
    setTimeout(() => setLoading(false), 1500);
  }, []);

  return (
    <View style={styles.container}>
      {/* HEADER TÁCTICO */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>COMMAND CENTER</Text>
          <Text style={styles.headerSubtitle}>SISTEMA DE CONTROL MAESTRO</Text>
        </View>
        <View style={styles.onlineBadge}>
          <View style={styles.dot} />
          <Text style={styles.onlineText}>{stats.online} SOCIOS ONLINE</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        
        {/* RADAR DE FLOTA (NIVEL DIOS) */}
        <Text style={styles.sectionLabel}>RADAR TÁCTICO DE CANALES</Text>
        <View style={styles.radarBox}>
          <View style={styles.radarLine} />
          <View style={[styles.radarLine, { left: width * 0.3 }]} />
          <View style={[styles.radarLine, { left: width * 0.6 }]} />
          
          {flota.map(t => (
            <View key={t.id} style={[styles.shipIcon, { left: `${t.pos}%`, top: t.id * 40 }]}>
              <Text style={{ fontSize: 20 }}>{t.status === 'SOS' ? '🚨' : '🛶'}</Text>
              <Text style={styles.shipName}>{t.name}</Text>
            </View>
          ))}
        </View>

        {/* MÉTRICAS DE PULSO */}
        <View style={styles.metricsRow}>
          <View style={styles.mCard}>
            <Text style={styles.mLab}>INGRESOS HOY</Text>
            <Text style={styles.mVal}>${stats.revenue.toLocaleString()}</Text>
            <Text style={styles.mDelta}>+12% vs Ayer</Text>
          </View>
          <View style={[styles.mCard, stats.sos > 0 && styles.mCardAlert]}>
            <Text style={styles.mLab}>STATUS SEGURIDAD</Text>
            <Text style={[styles.mVal, stats.sos > 0 && { color: '#f00' }]}>{stats.sos === 0 ? "TODO OK" : "ALERTA"}</Text>
            <Text style={styles.mDelta}>{stats.sos} SOS Activos</Text>
          </View>
        </View>

        {/* CONTROL DE CAPITANES */}
        <Text style={styles.sectionLabel}>VALIDACIÓN DE CAPITANES CERTIFICADOS</Text>
        <View style={styles.listCard}>
          <View style={styles.listItem}>
            <View style={styles.capInfo}>
              <View style={styles.capAvatar}><Text style={{color:'#fff'}}>JB</Text></View>
              <View>
                <Text style={styles.capName}>Juan B. Morales</Text>
                <Text style={styles.capDocs}>INE • Permiso Fluvial • Fotos</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.verifyBtn}>
              <Text style={styles.verifyText}>REVISAR</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FEED DE ACTIVIDAD EN VIVO */}
        <Text style={styles.sectionLabel}>ACTIVIDAD EN TIEMPO REAL</Text>
        <View style={styles.feedBox}>
          <Text style={styles.feedItem}>🕒 01:25 - Nueva Reserva: Isla Muñecas ($3,500)</Text>
          <Text style={styles.feedItem}>🕒 01:20 - Mariachi abordado en 'Trajinera La Flor'</Text>
          <Text style={styles.feedItem}>🕒 01:15 - Pago Confirmado: $1,200 (Bebidas)</Text>
        </View>

      </ScrollView>

      {/* BOTÓN MAESTRO DE SOS GLOBAL */}
      <TouchableOpacity style={styles.sosGlobal} onPress={() => Alert.alert("ALERTA GLOBAL", "Notificando a todos los capitanes de situación de riesgo.")}>
        <Text style={styles.sosGlobalText}>DIFUSIÓN DE EMERGENCIA 📢</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: { paddingTop: 60, paddingHorizontal: 25, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#111', paddingBottom: 20 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '900', letterSpacing: 2 },
  headerSubtitle: { color: '#F8D36B', fontSize: 8, fontWeight: '900', letterSpacing: 3, marginTop: 4 },
  onlineBadge: { backgroundColor: '#064e3b', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, flexDirection: 'row', alignItems: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#00E676', marginRight: 8 },
  onlineText: { color: '#00E676', fontSize: 9, fontWeight: '900' },
  scroll: { paddingBottom: 150 },
  sectionLabel: { color: '#444', fontSize: 10, fontWeight: '900', marginHorizontal: 25, marginTop: 35, marginBottom: 15, letterSpacing: 2 },
  radarBox: { height: 200, backgroundColor: '#050505', marginHorizontal: 25, borderRadius: 30, borderWidth: 1, borderColor: '#111', overflow: 'hidden' },
  radarLine: { position: 'absolute', width: 1, height: '100%', backgroundColor: '#111' },
  shipIcon: { position: 'absolute', alignItems: 'center' },
  shipName: { color: '#666', fontSize: 8, fontWeight: '800', marginTop: 4 },
  metricsRow: { flexDirection: 'row', paddingHorizontal: 20, marginTop: 20, gap: 10 },
  mCard: { flex: 1, backgroundColor: '#080808', padding: 25, borderRadius: 30, borderWidth: 1, borderColor: '#111' },
  mCardAlert: { borderColor: '#f00', backgroundColor: '#100000' },
  mLab: { color: '#444', fontSize: 9, fontWeight: '900', marginBottom: 8 },
  mVal: { color: '#fff', fontSize: 24, fontWeight: '900' },
  mDelta: { color: '#00E676', fontSize: 10, fontWeight: '800', marginTop: 5 },
  listCard: { marginHorizontal: 25, backgroundColor: '#080808', borderRadius: 30, padding: 5, borderWidth: 1, borderColor: '#111' },
  listItem: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  capAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#222', justifyContent: 'center', alignItems: 'center' },
  capInfo: { flexDirection: 'row', alignItems: 'center' },
  capName: { color: '#fff', fontSize: 14, fontWeight: '900', marginLeft: 15 },
  capDocs: { color: '#444', fontSize: 10, fontWeight: '700', marginLeft: 15, marginTop: 2 },
  verifyBtn: { backgroundColor: '#F8D36B', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 12 },
  verifyText: { color: '#000', fontSize: 10, fontWeight: '900' },
  feedBox: { marginHorizontal: 25, backgroundColor: '#050505', padding: 20, borderRadius: 25, borderWidth: 1, borderColor: '#111' },
  feedItem: { color: '#666', fontSize: 11, marginBottom: 10, fontWeight: '700' },
  sosGlobal: { position: 'absolute', bottom: 40, left: 25, right: 25, backgroundColor: '#f00', height: 65, borderRadius: 25, justifyContent: 'center', alignItems: 'center', shadowColor: '#f00', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 15 },
  sosGlobalText: { color: '#fff', fontWeight: '900', fontSize: 14, letterSpacing: 1 }
});