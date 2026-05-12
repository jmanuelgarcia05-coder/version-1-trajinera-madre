import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { supabase } from "../lib/supabase";

export default function ValorarScreen() {
  const router = useRouter();
  const { reservaId, experiencia } = useLocalSearchParams();
  const [rating, setRating] = useState(5);
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);

  const enviarValoracion = async () => {
    setEnviando(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id;

      if (!userId) throw new Error("Sesión expirada");

      const { error } = await supabase.from("valoraciones").insert([
        {
          reserva_id: reservaId,
          user_id: userId,
          puntuacion: rating,
          comentario: comentario.trim(),
          experiencia: experiencia,
        },
      ]);

      if (error) throw error;

      // Mandamos al usuario directo al inicio sin esperar alertas
      router.replace("/selector");
      
    } catch (error: any) {
      console.error("Error al valorar:", error);
      Alert.alert("Error al enviar", error.message || "Error desconocido");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Cómo estuvo tu viaje?</Text>
      <Text style={styles.subtitle}>{experiencia}</Text>

      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Text style={[styles.star, rating >= star ? styles.starActive : styles.starInactive]}>
              ★
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.ratingText}>
        {rating === 5 ? "¡Excelente! 😍" : rating === 4 ? "Muy bueno 🙂" : rating === 3 ? "Bueno 😐" : "Podría mejorar ☹️"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Cuéntanos más sobre tu experiencia..."
        placeholderTextColor="#666"
        multiline
        numberOfLines={4}
        value={comentario}
        onChangeText={setComentario}
      />

      <TouchableOpacity 
        style={[styles.submitButton, enviando && { opacity: 0.7 }]} 
        onPress={enviarValoracion}
        disabled={enviando}
      >
        {enviando ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.submitButtonText}>Enviar Calificación</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.skipText}>Saltar por ahora</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#050505", padding: 30, justifyContent: "center" },
  title: { color: "#F8D36B", fontSize: 32, fontWeight: "900", textAlign: "center" },
  subtitle: { color: "#fff", fontSize: 18, textAlign: "center", marginTop: 10, opacity: 0.7 },
  starsContainer: { flexDirection: "row", justifyContent: "center", marginVertical: 30 },
  star: { fontSize: 50, marginHorizontal: 5 },
  starActive: { color: "#F8D36B" },
  starInactive: { color: "#222" },
  ratingText: { color: "#F8D36B", textAlign: "center", fontSize: 20, fontWeight: "800", marginBottom: 30 },
  input: {
    backgroundColor: "#111",
    color: "#fff",
    padding: 20,
    borderRadius: 20,
    height: 120,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#222",
    marginBottom: 30,
  },
  submitButton: {
    backgroundColor: "#F8D36B",
    height: 60,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  submitButtonText: { color: "#000", fontSize: 18, fontWeight: "900" },
  skipText: { color: "#666", textAlign: "center", fontWeight: "700", textDecorationLine: "underline" },
});
