import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../lib/supabase";

export default function UsuarioScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reservas, setReservas] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Datos estáticos para descubrimiento (Próximamente de DB)
  const experiencias = [
    { id: '1', nombre: 'Amanecer en los Canales', emoji: '🌅' },
    { id: '2', nombre: 'Tour Gastronómico', emoji: '🌮' },
    { id: '3', nombre: 'Noche de Leyendas', emoji: '🕯️' },
  ];

  const embarcaderos = [
    { id: '1', nombre: 'Nuevo Nativitas', status: 'Abierto' },
    { id: '2', nombre: 'Las Flores', status: 'Abierto' },
    { id: '3', nombre: 'Cuemanco', status: 'Poca afluencia' },
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
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error) setReservas(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/selector")}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Mi Aventura</Text>
        <TouchableOpacity onPress={() => router.push("/mapa")}>
          <Text style={styles.mapIcon}>🗺️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F8D36B" />}
        contentContainerStyle={styles.scroll}
      >
        {/* Sección: Descubrir */}
        <Text style={styles.sectionTitle}>Explorar Xochimilco</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.discoverRow}>
          {experiencias.map(exp => (
            <TouchableOpacity key={exp.id} style={styles.discoverCard}>
              <Text style={styles.discoverEmoji}>{exp.emoji}</Text>
              <Text style={styles.discoverName}>{exp.nombre}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Sección: Embarcaderos */}
        <Text style={styles.sectionTitle}>Embarcaderos Cercanos</Text>
        <View style={styles.embarcaderosList}>
          {embarcaderos.map(emb => (
            <View key={emb.id} style={styles.embItem}>
              <Text style={styles.embName}>{emb.nombre}</Text>
              <Text style={styles.embStatus}>🟢 {emb.status}</Text>
            </View>
          ))}
        </View>

        {/* Sección: Mis Reservas */}
        <Text style={styles.sectionTitle}>Mis Viajes Solicitados</Text>
        {reservas.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Aún no tienes viajes. ¡Empieza a explorar!</Text>
          </View>
        ) : (
          reservas.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={styles.expName}>{item.experiencia}</Text>
                <View style={[styles.statusBadge, item.estado === 'confirmada' ? styles.statusConfirmed : styles.statusPending]}>
                  <Text style={styles.statusText}>{item.estado.toUpperCase()}</Text>
                </View>
              </View>
              
              <Text style={styles.price}>${item.total} MXN</Text>
              <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString()}</Text>

              <View style={styles.cardActions}>
                <TouchableOpacity 
                  style={styles.chatButton} 
                  onPress={() => router.push({ pathname: "/chat", params: { reservaId: item.id } })}
                >
                  <Text style={styles.chatButtonText}>💬 Abrir Chat</Text>
                </TouchableOpacity>

                {item.estado === 'completada' && (
                  <TouchableOpacity 
                    style={styles.rateButton}
                    onPress={() => router.push({ pathname: "/valorar", params: { reservaId: item.id } })}
                  >
                    <Text style={styles.rateButtonText}>⭐ Calificar</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" },
  header: { 
    paddingTop: 60, 
    paddingHorizontal: 25, 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    paddingBottom: 20 
  },
  title: { fontSize: 24, fontWeight: "900", color: "#fff" },
  backArrow: { fontSize: 24, color: "#F8D36B", fontWeight: "900" },
  mapIcon: { fontSize: 24 },
  scroll: { paddingBottom: 50 },
  sectionTitle: { color: "#F8D36B", fontSize: 18, fontWeight: "900", marginHorizontal: 25, marginTop: 25, marginBottom: 15 },
  discoverRow: { paddingLeft: 25 },
  discoverCard: { 
    backgroundColor: "#111", 
    padding: 20, 
    borderRadius: 20, 
    marginRight: 15, 
    width: 140, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222'
  },
  discoverEmoji: { fontSize: 30, marginBottom: 10 },
  discoverName: { color: "#fff", fontSize: 12, fontWeight: "800", textAlign: "center" },
  embarcaderosList: { marginHorizontal: 25, gap: 10 },
  embItem: { 
    backgroundColor: "#080808", 
    padding: 15, 
    borderRadius: 15, 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#111'
  },
  embName: { color: "#fff", fontWeight: "700" },
  embStatus: { color: "#666", fontSize: 12, fontWeight: "900" },
  card: { 
    backgroundColor: "#111", 
    marginHorizontal: 25, 
    padding: 20, 
    borderRadius: 25, 
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#222'
  },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  expName: { color: "#fff", fontSize: 18, fontWeight: "900", flex: 1 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusPending: { backgroundColor: "#332200" },
  statusConfirmed: { backgroundColor: "#113311" },
  statusText: { color: "#F8D36B", fontSize: 10, fontWeight: "900" },
  price: { color: "#F8D36B", fontSize: 22, fontWeight: "900" },
  date: { color: "#444", fontSize: 12, marginTop: 5, fontWeight: "600" },
  emptyCard: { marginHorizontal: 25, padding: 40, backgroundColor: '#050505', borderRadius: 25, alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#333' },
  emptyText: { color: '#444', textAlign: 'center', fontWeight: '700' },
  cardActions: { flexDirection: 'row', gap: 10, marginTop: 15 },
  chatButton: { flex: 1, backgroundColor: '#000', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#333', alignItems: 'center' },
  chatButtonText: { color: '#F8D36B', fontWeight: '900' },
  rateButton: { flex: 1, backgroundColor: '#F8D36B', padding: 12, borderRadius: 12, alignItems: 'center' },
  rateButtonText: { color: '#000', fontWeight: '900' },
});