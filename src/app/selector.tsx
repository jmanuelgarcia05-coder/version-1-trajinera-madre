import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../lib/supabase";

const ADMIN_EMAIL = "j.manuel.garcia05@gmail.com";

export default function SelectorScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [perfil, setPerfil] = useState<any>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    fetchPerfil();
  }, []);

  const fetchPerfil = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setLoading(false);
      return;
    }

    setUserEmail(session.user.email || "");

    const { data, error } = await supabase
      .from("perfiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo cargar tu perfil.");
      setLoading(false);
      return;
    }

    setPerfil(data);
    setLoading(false);

    // Registrar para notificaciones
    if (data.id) {
      const { registerForPushNotificationsAsync } = require("../lib/notifications");
      registerForPushNotificationsAsync(data.id);
    }
  };

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#F8D36B" />
      </View>
    );
  }

  const esAdmin = userEmail === ADMIN_EMAIL;

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>¡Hola, {perfil?.nombre_completo?.split(' ')[0] || "Viajero"}!</Text>
      <Text style={styles.subtitle}>Selecciona el panel para comenzar:</Text>

      <View style={styles.menu}>
        <TouchableOpacity 
          style={[styles.menuButton, { backgroundColor: '#111', borderColor: '#F8D36B', borderWidth: 1 }]} 
          onPress={() => router.push("/usuario")}
        >
          <Text style={[styles.menuText, { color: '#F8D36B' }]}>🌊 Panel de Viajero</Text>
          <Text style={styles.menuDesc}>Explora canales, experiencias y tu historial</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.menuButton, { backgroundColor: '#111', borderColor: '#B45309', borderWidth: 1 }]} 
          onPress={() => router.push("/prestador")}
        >
          <Text style={[styles.menuText, { color: '#B45309' }]}>🛶 Panel de Prestador</Text>
          <Text style={styles.menuDesc}>Gestiona tus viajes, trajineras y remeros</Text>
        </TouchableOpacity>

        {esAdmin && (
          <TouchableOpacity 
            style={[styles.menuButton, { backgroundColor: '#111', borderColor: '#444', borderWidth: 1 }]} 
            onPress={() => router.push("/admin")}
          >
            <Text style={[styles.menuText, { color: '#888' }]}>🛡️ Panel Administrador Maestro</Text>
            <Text style={styles.menuDesc}>Control total y acceso a todo el sistema</Text>
          </TouchableOpacity>
        )}

        <View style={styles.divider} />

        <TouchableOpacity 
          style={[styles.menuButton, { backgroundColor: '#F8D36B' }]} 
          onPress={() => router.push("/perfil")}
        >
          <Text style={[styles.menuText, { color: '#000' }]}>👤 MI PERFIL</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={cerrarSesion}>
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 30,
    justifyContent: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  welcome: {
    fontSize: 40,
    fontWeight: "900",
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 50,
    fontWeight: "600",
  },
  menu: {
    gap: 15,
  },
  menuButton: {
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  menuText: {
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 5,
  },
  menuDesc: {
    color: "#555",
    fontSize: 12,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#222",
    marginVertical: 10,
  },
  logoutButton: {
    marginTop: 40,
    alignItems: "center",
  },
  logoutText: {
    color: "#ff4444",
    fontWeight: "900",
    fontSize: 14,
    letterSpacing: 1,
  },
});
