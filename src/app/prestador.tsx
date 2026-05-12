import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../lib/supabase";

export default function PrestadorScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reservas, setReservas] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Datos de gestión operativa (Simulados - Próximamente vinculados a DB)
  const misTrajineras = [
    { id: '1', nombre: 'La Lupita', status: 'En Servicio', cap: 20 },
    { id: '2', nombre: 'Xochimilco Mágico', status: 'Disponible', cap: 15 },
  ];

  const misRemeros = [
    { id: '1', nombre: 'Juan Pérez', status: 'Navegando' },
    { id: '2', nombre: 'Roberto Gómez', status: 'Descanso' },
  ];

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("reservas")
        .select("*")
        .eq("prestador_id", user.id)
        .order("created_at", { ascending: false });

      if (!error) setReservas(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const cambiarEstado = async (id: string, nuevoEstado: string) => {
    const { error } = await supabase
      .from("reservas")
      .update({ estado: nuevoEstado })
      .eq("id", id);

    if (!error) {
      Alert.alert("Éxito", `Viaje marcado como ${nuevoEstado}`);
      cargarDatos();
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    cargarDatos();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#F8D36B" />
      </View>
    );
  }

  const enCurso = reservas.filter(r => r.estado === 'confirmada' || r.estado === 'en_curso');
  const historico = reservas.filter(r => r.estado === 'completada' || r.estado === 'cancelada');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/selector")}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Gestión Operativa</Text>
        <TouchableOpacity onPress={() => router.push("/mapa")}>
          <Text style={styles.radarIcon}>🛰️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F8D36B" />}
        contentContainerStyle={styles.scroll}
      >
        {/* SECCIÓN: MI FLOTA */}
        <Text style={styles.sectionTitle}>Mi Flota (Trajineras)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.fleetRow}>
          {misTrajineras.map(t => (
            <View key={t.id} style={styles.fleetCard}>
              <Text style={styles.fleetEmoji}>🛶</Text>
              <Text style={styles.fleetName}>{t.nombre}</Text>
              <Text style={[styles.fleetStatus, { color: t.status === 'En Servicio' ? '#00E676' : '#F8D36B' }]}>{t.status}</Text>
            </View>
          ))}
          <TouchableOpacity style={styles.addCard}>
            <Text style={styles.addIcon}>+</Text>
            <Text style={styles.addText}>Alta Trajinera</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* SECCIÓN: MIS REMEROS */}
        <Text style={styles.sectionTitle}>Remeros Activos</Text>
        <View style={styles.remerosList}>
          {misRemeros.map(r => (
            <View key={r.id} style={styles.remeroItem}>
              <View>
                <Text style={styles.remeroName}>{r.nombre}</Text>
                <Text style={styles.remeroStatus}>{r.status}</Text>
              </View>
              <TouchableOpacity style={styles.callBtn}>
                <Text>📞</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* SECCIÓN: VIAJES EN CURSO */}
        <Text style={styles.sectionTitle}>Viajes en Curso / Próximos</Text>
        {enCurso.length === 0 ? (
          <Text style={styles.emptyText}>No hay servicios activos en este momento.</Text>
        ) : (
          enCurso.map(reserva => (
            <View key={reserva.id} style={styles.reservaCard}>
              <View style={styles.reservaHeader}>
                <Text style={styles.reservaUser}>Cliente: {reserva.nombre_cliente || "Usuario"}</Text>
                <View style={styles.confirmBadge}><Text style={styles.badgeText}>ACTIVO</Text></View>
              </View>
              <Text style={styles.reservaExp}>✨ {reserva.experiencia}</Text>
              
              <View style={styles.reservaActions}>
                <TouchableOpacity 
                  style={styles.chatBtn}
                  onPress={() => router.push({ pathname: "/chat", params: { reservaId: reserva.id } })}
                >
                  <Text style={styles.chatBtnText}>💬 Chat</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.completeBtn}
                  onPress={() => cambiarEstado(reserva.id, 'completada')}
                >
                  <Text style={styles.completeBtnText}>Finalizar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        {/* SECCIÓN: HISTÓRICO */}
        <Text style={styles.sectionTitle}>Historial de Servicios</Text>
        <View style={styles.historicoList}>
          {historico.map(h => (
            <View key={h.id} style={styles.historicoItem}>
              <Text style={styles.historicoText}>{h.experiencia}</Text>
              <Text style={styles.historicoDate}>{new Date(h.created_at).toLocaleDateString()}</Text>
              <Text style={styles.historicoPrice}>${h.total} MXN</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity 
          style={styles.sosButton}
          onPress={() => router.push("/mapa")}
        >
          <Text style={styles.sosText}>🚨 ACTIVAR SOS / EMERGENCIAS</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" },
  header: { paddingTop: 60, paddingHorizontal: 25, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: 20 },
  title: { fontSize: 22, fontWeight: "900", color: "#fff" },
  backArrow: { fontSize: 24, color: "#F8D36B", fontWeight: "900" },
  radarIcon: { fontSize: 24 },
  scroll: { paddingBottom: 60 },
  sectionTitle: { color: "#F8D36B", fontSize: 16, fontWeight: "900", marginHorizontal: 25, marginTop: 30, marginBottom: 15, textTransform: 'uppercase', letterSpacing: 1 },
  fleetRow: { paddingLeft: 25 },
  fleetCard: { backgroundColor: "#111", padding: 20, borderRadius: 20, marginRight: 15, width: 150, borderWidth: 1, borderColor: '#222' },
  fleetEmoji: { fontSize: 24, marginBottom: 10 },
  fleetName: { color: "#fff", fontWeight: "900", fontSize: 14 },
  fleetStatus: { fontSize: 10, fontWeight: "700", marginTop: 4 },
  addCard: { width: 150, borderRadius: 20, borderStyle: 'dashed', borderWidth: 1, borderColor: '#333', justifyContent: 'center', alignItems: 'center', backgroundColor: '#050505', marginRight: 25 },
  addIcon: { color: '#444', fontSize: 30, fontWeight: '300' },
  addText: { color: '#444', fontSize: 10, fontWeight: '700', marginTop: 5 },
  remerosList: { marginHorizontal: 25, gap: 10 },
  remeroItem: { backgroundColor: "#080808", padding: 15, borderRadius: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#111' },
  remeroName: { color: '#fff', fontWeight: '800' },
  remeroStatus: { color: '#666', fontSize: 11, fontWeight: '600' },
  callBtn: { backgroundColor: '#111', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: '#222' },
  reservaCard: { backgroundColor: "#111", marginHorizontal: 25, padding: 20, borderRadius: 25, marginBottom: 15, borderWidth: 1, borderColor: '#333' },
  reservaHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  reservaUser: { color: '#fff', fontWeight: '900', fontSize: 16 },
  confirmBadge: { backgroundColor: '#004D40', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { color: '#00E676', fontSize: 9, fontWeight: '900' },
  reservaExp: { color: '#888', fontWeight: '600', marginBottom: 15 },
  reservaActions: { flexDirection: 'row', gap: 10 },
  chatBtn: { flex: 1, backgroundColor: '#000', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#333', alignItems: 'center' },
  chatBtnText: { color: '#F8D36B', fontWeight: '900' },
  completeBtn: { flex: 1, backgroundColor: '#F8D36B', padding: 12, borderRadius: 12, alignItems: 'center' },
  completeBtnText: { color: '#000', fontWeight: '900' },
  historicoList: { marginHorizontal: 25, backgroundColor: '#080808', borderRadius: 20, padding: 10 },
  historicoItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#111', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  historicoText: { color: '#fff', fontSize: 12, fontWeight: '700', flex: 1 },
  historicoDate: { color: '#444', fontSize: 10, marginHorizontal: 10 },
  historicoPrice: { color: '#F8D36B', fontWeight: '900', fontSize: 12 },
  emptyText: { color: '#444', textAlign: 'center', marginHorizontal: 25, fontStyle: 'italic' },
  sosButton: { margin: 25, backgroundColor: '#330000', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#660000', alignItems: 'center' },
  sosText: { color: '#FF4444', fontWeight: '900', letterSpacing: 1 },
});