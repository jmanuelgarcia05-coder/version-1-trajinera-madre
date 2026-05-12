import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../lib/supabase";

export default function ResenasScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [resenas, setResenas] = useState<any[]>([]);

  useEffect(() => {
    cargarResenas();
  }, []);

  const cargarResenas = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Buscamos valoraciones donde la reserva pertenezca a este prestador
      // Usamos un join (inner join) para filtrar por prestador_id
      const { data, error } = await supabase
        .from("valoraciones")
        .select(`
          *,
          reservas!inner(prestador_id, fecha, hora)
        `)
        .eq("reservas.prestador_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setResenas(data || []);
    } catch (error: any) {
      console.error("Error al cargar reseñas:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (puntuacion: number) => {
    return "⭐".repeat(puntuacion);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#F8D36B" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Mis Valoraciones</Text>
      </View>

      {resenas.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aún no tienes valoraciones de tus clientes.</Text>
          <Text style={styles.emptySub}>¡Sigue dando un gran servicio para recibirlas!</Text>
        </View>
      ) : (
        <FlatList
          data={resenas}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.stars}>{renderStars(item.puntuacion)}</Text>
                <Text style={styles.date}>
                  {new Date(item.created_at).toLocaleDateString()}
                </Text>
              </View>
              <Text style={styles.comment}>"{item.comentario || "Sin comentario"}"</Text>
              <View style={styles.footer}>
                <Text style={styles.experienceTag}>Experiencia: {item.experiencia || "Estándar"}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#000" },
  center: { flex: 1, backgroundColor: "#000", justifyContent: "center", alignItems: "center" },
  header: { 
    paddingTop: 60, 
    paddingHorizontal: 25, 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 20 
  },
  backBtn: { width: 45, height: 45, backgroundColor: "#111", borderRadius: 12, justifyContent: "center", alignItems: "center", marginRight: 15 },
  backBtnText: { color: "#F8D36B", fontSize: 20, fontWeight: "900" },
  title: { fontSize: 28, fontWeight: "900", color: "#fff" },
  list: { padding: 25 },
  card: {
    backgroundColor: "#111",
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#222",
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  stars: { fontSize: 18 },
  date: { color: "#444", fontSize: 12, fontWeight: "700" },
  comment: { color: "#ccc", fontSize: 16, fontStyle: "italic", lineHeight: 22 },
  footer: { marginTop: 15, borderTopWidth: 1, borderTopColor: "#1a1a1a", paddingTop: 10 },
  experienceTag: { color: "#F8D36B", fontSize: 12, fontWeight: "900", textTransform: "uppercase" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  emptyText: { color: "#fff", fontSize: 18, fontWeight: "900", textAlign: "center", marginBottom: 10 },
  emptySub: { color: "#444", textAlign: "center" },
});
