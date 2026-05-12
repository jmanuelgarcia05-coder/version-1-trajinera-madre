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
} from "react-native";
import { supabase } from "../lib/supabase";

export default function AdminScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Estadísticas Maestras
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeTrips: 0,
    completedTrips: 0,
    totalUsers: 0,
    avgRating: 0,
    sosActivos: 0
  });

  const [prestadores, setPrestadores] = useState<any[]>([]);
  const [recientes, setRecientes] = useState<any[]>([]);
  const [alertas, setAlertas] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    cargarTodo();
  }, []);

  const cargarTodo = async () => {
    try {
      // 1. Cargar todas las reservas para métricas
      const { data: reservas } = await supabase.from("reservas").select("*");
      
      // 2. Cargar perfiles para gestión
      const { data: perfiles } = await supabase.from("perfiles").select("*");

      // 3. Cargar alertas SOS
      const { data: sData } = await supabase.from("alertas_sos").select("*").eq("estado", "activa");

      if (reservas && perfiles) {
        const rev = reservas.reduce((acc, r) => acc + (r.total || 0), 0);
        const act = reservas.filter(r => r.estado === 'confirmada' || r.estado === 'en_curso').length;
        const comp = reservas.filter(r => r.estado === 'completada').length;
        const ratings = reservas.filter(r => r.rating).map(r => r.rating);
        const avg = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : "5.0";

        setStats({
          totalRevenue: rev,
          activeTrips: act,
          completedTrips: comp,
          totalUsers: perfiles.length,
          avgRating: Number(avg),
          sosActivos: sData?.length || 0
        });

        setPrestadores(perfiles.filter(p => p.rol === 'prestador'));
        setRecientes(reservas.slice(0, 5)); // Últimos 5 viajes
        setAlertas(sData || []);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const aprobarPrestador = async (id: string, status: boolean) => {
    const { error } = await supabase.from("perfiles").update({ aprobado: status }).eq("id", id);
    if (!error) {
      Alert.alert("Éxito", status ? "Socio Aprobado" : "Acceso Revocado");
      cargarTodo();
    }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#F8D36B" /></View>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/selector")}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Panel Maestro</Text>
        <TouchableOpacity onPress={cargarTodo}>
          <Text style={styles.refreshIcon}>🔄</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={cargarTodo} tintColor="#F8D36B" />}
        contentContainerStyle={styles.scroll}
      >
        {/* RESUMEN FINANCIERO Y OPERATIVO */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricVal}>${stats.totalRevenue.toLocaleString()}</Text>
            <Text style={styles.metricLab}>Ingresos Globales</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={[styles.metricVal, { color: '#00E676' }]}>⭐ {stats.avgRating}</Text>
            <Text style={styles.metricLab}>Satisfacción</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricVal}>{stats.activeTrips}</Text>
            <Text style={styles.metricLab}>Viajes Hoy</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricVal}>{stats.totalUsers}</Text>
            <Text style={styles.metricLab}>Comunidad</Text>
          </View>
        </View>

        {/* MONITOR DE EMERGENCIAS */}
        {alertas.length > 0 && (
          <View style={styles.sosSection}>
            <Text style={styles.sectionTitle}>🚨 ALERTAS SOS EN CURSO</Text>
            {alertas.map(a => (
              <TouchableOpacity key={a.id} style={styles.sosAlert} onPress={() => router.push("/mapa")}>
                <Text style={styles.sosText}>Emergencia activa en los canales</Text>
                <Text style={styles.sosBtn}>IR AL RADAR ➔</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* GESTIÓN DE SOCIOS (PRESTADORES) */}
        <Text style={styles.sectionTitle}>Validación de Socios Prestadores</Text>
        {prestadores.map(p => (
          <View key={p.id} style={styles.pCard}>
            <View style={styles.pInfo}>
              <View>
                <Text style={styles.pName}>{p.nombre_completo}</Text>
                <Text style={styles.pEmail}>{p.id.substring(0,8)}... | {p.telefono || "Sin tel"}</Text>
              </View>
              <View style={[styles.pBadge, { backgroundColor: p.aprobado ? '#003300' : '#330000' }]}>
                <Text style={[styles.pBadgeText, { color: p.aprobado ? '#00E676' : '#FF5252' }]}>
                  {p.aprobado ? "ACTIVO" : "BLOQUEADO"}
                </Text>
              </View>
            </View>
            <View style={styles.pActions}>
              <TouchableOpacity style={styles.pDocBtn} onPress={() => setSelectedItem(p)}>
                <Text style={styles.pDocText}>Ver Papelería</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.pActionBtn, { backgroundColor: p.aprobado ? '#330000' : '#003300' }]}
                onPress={() => aprobarPrestador(p.id, !p.aprobado)}
              >
                <Text style={{ color: p.aprobado ? '#FF5252' : '#00E676', fontWeight: '900', fontSize: 12 }}>
                  {p.aprobado ? "SUSPENDER" : "ACTIVAR"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* ÚLTIMOS MOVIMIENTOS */}
        <Text style={styles.sectionTitle}>Actividad Reciente</Text>
        <View style={styles.recentList}>
          {recientes.map(r => (
            <View key={r.id} style={styles.recentItem}>
              <Text style={styles.recentExp}>{r.experiencia}</Text>
              <Text style={styles.recentStatus}>{r.estado.toUpperCase()}</Text>
              <Text style={styles.recentPrice}>${r.total}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* MODAL DE DOCUMENTOS */}
      {selectedItem && (
        <View style={styles.modalBack}>
          <View style={styles.modalCont}>
            <Text style={styles.modalTitle}>Expediente Digital</Text>
            <Text style={styles.modalSub}>{selectedItem.nombre_completo}</Text>
            <View style={styles.docFrame}>
              <Text style={styles.docMsg}>📄 Visualizando INE y Permisos de Navegación...</Text>
            </View>
            <TouchableOpacity style={styles.modalClose} onPress={() => setSelectedItem(null)}>
              <Text style={styles.modalCloseText}>CERRAR EXPEDIENTE</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" },
  header: { paddingTop: 60, paddingHorizontal: 25, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#111' },
  title: { fontSize: 22, fontWeight: "900", color: "#fff" },
  backArrow: { fontSize: 24, color: "#F8D36B", fontWeight: "900" },
  refreshIcon: { fontSize: 20 },
  scroll: { paddingBottom: 50 },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 15, gap: 10 },
  metricCard: { flex: 1, minWidth: '45%', backgroundColor: '#080808', padding: 20, borderRadius: 25, borderWidth: 1, borderColor: '#151515' },
  metricVal: { color: '#fff', fontSize: 22, fontWeight: '900' },
  metricLab: { color: '#444', fontSize: 10, fontWeight: '800', marginTop: 5, textTransform: 'uppercase' },
  sosSection: { margin: 20, backgroundColor: '#220000', borderRadius: 25, padding: 20, borderWidth: 1, borderColor: '#440000' },
  sectionTitle: { color: "#F8D36B", fontSize: 14, fontWeight: "900", marginHorizontal: 25, marginTop: 25, marginBottom: 15, textTransform: 'uppercase', letterSpacing: 1 },
  sosAlert: { backgroundColor: '#330000', padding: 15, borderRadius: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sosText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  sosBtn: { color: '#FF5252', fontSize: 10, fontWeight: '900' },
  pCard: { backgroundColor: '#080808', marginHorizontal: 20, padding: 20, borderRadius: 25, marginBottom: 12, borderWidth: 1, borderColor: '#151515' },
  pInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  pName: { color: '#fff', fontSize: 16, fontWeight: '900' },
  pEmail: { color: '#444', fontSize: 11, marginTop: 2 },
  pBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  pBadgeText: { fontSize: 9, fontWeight: '900' },
  pActions: { flexDirection: 'row', gap: 10 },
  pDocBtn: { flex: 2, backgroundColor: '#111', padding: 12, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#222' },
  pDocText: { color: '#888', fontWeight: '800', fontSize: 12 },
  pActionBtn: { flex: 1, padding: 12, borderRadius: 12, alignItems: 'center' },
  recentList: { marginHorizontal: 20, backgroundColor: '#050505', borderRadius: 25, padding: 10 },
  recentItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#111', flexDirection: 'row', justifyContent: 'space-between' },
  recentExp: { color: '#fff', fontSize: 12, fontWeight: '700', flex: 1 },
  recentStatus: { color: '#444', fontSize: 10, fontWeight: '900', marginHorizontal: 10 },
  recentPrice: { color: '#F8D36B', fontWeight: '900', fontSize: 12 },
  modalBack: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', alignItems: 'center', padding: 25 },
  modalCont: { backgroundColor: '#080808', width: '100%', borderRadius: 30, padding: 30, borderWidth: 1, borderColor: '#222' },
  modalTitle: { color: '#444', fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  modalSub: { color: '#fff', fontSize: 22, fontWeight: '900', marginTop: 5 },
  docFrame: { height: 250, backgroundColor: '#000', borderRadius: 20, marginVertical: 30, justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#333' },
  docMsg: { color: '#333', fontWeight: '800' },
  modalClose: { backgroundColor: '#F8D36B', padding: 20, borderRadius: 18, alignItems: 'center' },
  modalCloseText: { color: '#000', fontWeight: '900' },
});