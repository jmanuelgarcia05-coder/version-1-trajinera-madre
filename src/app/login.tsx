import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { supabase } from "../lib/supabase";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const entrarConSocial = async (provider: "google" | "facebook") => {
    try {
      // SIN OPCIONES. Que Supabase use su configuración por defecto del panel.
      const { error } = await supabase.auth.signInWithOAuth({
        provider
      });

      if (error) throw error;
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const entrar = async () => {
    if (!email || !password) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });
      if (error) throw error;
      if (data.user) router.replace("/selector");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>TrajinerApp</Text>
        <Text style={styles.subtitle}>Inicia sesión</Text>
      </View>

      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton} onPress={() => entrarConSocial("google")}>
          <Text style={styles.socialText}>G  Google</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#1877F2' }]} onPress={() => entrarConSocial("facebook")}>
          <Text style={[styles.socialText, { color: '#fff' }]}>f  Facebook</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>o con email</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.formCard}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#666"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.mainButton} onPress={entrar} disabled={loading}>
          {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.mainButtonText}>Entrar</Text>}
        </TouchableOpacity>

        <TouchableOpacity 
          style={{ marginTop: 40, padding: 20 }} 
          onPress={() => router.replace("/selector")}
        >
          <Text style={{ color: '#F8D36B', textAlign: 'center', fontWeight: '900', fontSize: 16 }}>
            👉 [DEBUG] ENTRAR SIN LOGIN 👈
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#050505" },
  container: { padding: 30, paddingTop: 80 },
  header: { marginBottom: 40, alignItems: "center" },
  title: { fontSize: 48, fontWeight: "900", color: "#F8D36B" },
  subtitle: { fontSize: 18, color: "#888", marginTop: 4 },
  socialContainer: { flexDirection: 'row', gap: 15, marginBottom: 30 },
  socialButton: {
    flex: 1,
    height: 64,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  socialText: { color: "#000", fontWeight: "900", fontSize: 16 },
  divider: { flexDirection: "row", alignItems: "center", marginBottom: 30 },
  line: { flex: 1, height: 1, backgroundColor: "#222" },
  dividerText: { color: "#444", marginHorizontal: 15, fontSize: 14, fontWeight: "800" },
  formCard: { gap: 15 },
  input: {
    backgroundColor: "#111",
    height: 64,
    paddingHorizontal: 20,
    borderRadius: 20,
    color: "#fff",
    borderWidth: 1,
    borderColor: "#222",
  },
  mainButton: {
    backgroundColor: "#F8D36B",
    height: 64,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  mainButtonText: { color: "#000", fontSize: 18, fontWeight: "900" },
});