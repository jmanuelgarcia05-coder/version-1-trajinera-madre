import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../lib/supabase";

export default function PerfilScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [perfil, setPerfil] = useState<any>(null);
  
  // Estados para el formulario
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [idioma, setIdioma] = useState("es");

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }

      const { data, error } = await supabase
        .from("perfiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      setPerfil(data);
      setNombre(data.nombre_completo || "");
      setTelefono(data.telefono || "");
      setIdioma(data.idioma || "es");
    } catch (error: any) {
      Alert.alert("Error", "No se pudo cargar el perfil");
    } finally {
      setLoading(false);
    }
  };

  const guardarCambios = async () => {
    setGuardando(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from("perfiles")
        .update({
          nombre_completo: nombre,
          telefono: telefono,
          idioma: idioma,
        })
        .eq("id", user?.id);

      if (error) throw error;
      Alert.alert("Éxito", "Perfil actualizado correctamente");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setGuardando(false);
    }
  };

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#F8D36B" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Mi Perfil</Text>
      </View>

      <View style={styles.avatarContainer}>
        <View style={styles.avatarFrame}>
          <Image 
            source={{ uri: `https://api.dicebear.com/7.x/avataaars/svg?seed=${perfil?.id}` }} 
            style={styles.avatar} 
          />
        </View>
        <Text style={styles.roleTag}>{perfil?.rol?.toUpperCase()}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Nombre Completo</Text>
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Tu nombre"
          placeholderTextColor="#444"
        />

        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          style={styles.input}
          value={telefono}
          onChangeText={setTelefono}
          placeholder="Tu número"
          placeholderTextColor="#444"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Idioma de Traducción</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.langContainer}>
          {[
            { id: 'es', label: 'Español 🇲🇽' },
            { id: 'en', label: 'English 🇺🇸' },
            { id: 'it', label: 'Italiano 🇮🇹' },
            { id: 'zh', label: '中文 🇨🇳' },
            { id: 'ja', label: '日本語 🇯🇵' },
            { id: 'ru', label: 'Русский 🇷🇺' },
            { id: 'fi', label: 'Suomi 🇫🇮' },
            { id: 'pt', label: 'Português 🇧🇷' },
            { id: 'fr', label: 'Français 🇫🇷' },
          ].map((lang) => (
            <TouchableOpacity 
              key={lang.id}
              style={[styles.langBtn, idioma === lang.id && styles.langBtnActive]}
              onPress={() => setIdioma(lang.id)}
            >
              <Text style={[styles.langBtnText, idioma === lang.id && styles.langBtnTextActive]}>
                {lang.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={guardarCambios}
          disabled={guardando}
        >
          {guardando ? <ActivityIndicator color="#000" /> : <Text style={styles.saveButtonText}>Guardar Cambios</Text>}
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={cerrarSesion}>
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#000" },
  container: { padding: 25, paddingTop: 60 },
  centered: { flex: 1, backgroundColor: "#000", justifyContent: "center", alignItems: "center" },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 40 },
  backButton: { padding: 10, backgroundColor: "#111", borderRadius: 12, marginRight: 20 },
  backText: { color: "#F8D36B", fontWeight: "900" },
  title: { fontSize: 32, fontWeight: "900", color: "#fff" },
  avatarContainer: { alignItems: "center", marginBottom: 40 },
  avatarFrame: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#F8D36B",
    padding: 5,
    backgroundColor: "#111",
  },
  avatar: { width: "100%", height: "100%", borderRadius: 55 },
  roleTag: {
    marginTop: 15,
    backgroundColor: "#F8D36B",
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 20,
    color: "#000",
    fontWeight: "900",
    fontSize: 12,
  },
  card: {
    backgroundColor: "#111",
    padding: 25,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#222",
  },
  label: { color: "#666", fontSize: 14, fontWeight: "900", marginBottom: 8, marginLeft: 5 },
  input: {
    backgroundColor: "#050505",
    height: 60,
    borderRadius: 18,
    color: "#fff",
    paddingHorizontal: 20,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#222",
  },
  saveButton: {
    backgroundColor: "#F8D36B",
    height: 60,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: { color: "#000", fontSize: 18, fontWeight: "900" },
  langContainer: { flexDirection: 'row', marginBottom: 25 },
  langBtn: { backgroundColor: '#050505', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#222', alignItems: 'center', marginRight: 10 },
  langBtnActive: { borderColor: '#F8D36B', backgroundColor: '#111' },
  langBtnText: { color: '#666', fontWeight: '700', fontSize: 13 },
  langBtnTextActive: { color: '#F8D36B' },
  logoutButton: {
    marginTop: 40,
    padding: 20,
    alignItems: "center",
  },
  logoutText: { color: "#ff4444", fontWeight: "900", fontSize: 16 },
});
