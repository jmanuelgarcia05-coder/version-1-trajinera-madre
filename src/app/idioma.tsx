import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
} from "react-native";
import { IDIOMAS, t } from "../lib/i18n";
import { supabase } from "../lib/supabase";

export default function IdiomaScreen() {
  const [idioma, setIdioma] = useState("es");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    cargarIdioma();
  }, []);

  async function cargarIdioma() {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;

    if (!user) return;

    setUserId(user.id);

    const { data: perfil } = await supabase
      .from("perfiles")
      .select("idioma")
      .eq("id", user.id)
      .single();

    if (perfil?.idioma) {
      setIdioma(perfil.idioma);
    }
  }

  async function guardarIdioma() {
    if (!userId) {
      Alert.alert("Sesión requerida", "Inicia sesión primero.");
      return;
    }

    const { error } = await supabase
      .from("perfiles")
      .update({ idioma })
      .eq("id", userId);

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    Alert.alert(t(idioma, "languageSaved"));
    router.replace("/");
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t(idioma, "selectLanguage")}</Text>

      {IDIOMAS.map((item) => (
        <TouchableOpacity
          key={item.code}
          style={[
            styles.option,
            idioma === item.code && styles.optionSelected,
          ]}
          onPress={() => setIdioma(item.code)}
        >
          <Text
            style={[
              styles.optionText,
              idioma === item.code && styles.optionTextSelected,
            ]}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.saveButton} onPress={guardarIdioma}>
        <Text style={styles.saveText}>{t(idioma, "saveLanguage")}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>Volver</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#050505" },
  content: { padding: 20, paddingTop: 70 },

  title: {
    color: "#F8D36B",
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 24,
  },

  option: {
    backgroundColor: "#111",
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#333",
    marginBottom: 12,
  },

  optionSelected: {
    backgroundColor: "#F8D36B",
    borderColor: "#F8D36B",
  },

  optionText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16,
  },

  optionTextSelected: {
    color: "#050505",
  },

  saveButton: {
    backgroundColor: "#00E676",
    padding: 17,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 20,
  },

  saveText: {
    color: "#050505",
    fontWeight: "900",
    fontSize: 16,
  },

  backButton: {
    backgroundColor: "#151515",
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 12,
  },

  backText: {
    color: "#fff",
    fontWeight: "900",
  },
});