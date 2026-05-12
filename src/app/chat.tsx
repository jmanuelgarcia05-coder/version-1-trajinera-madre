import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState, useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../lib/supabase";
import { sendPushNotification } from "../lib/notifications";

export default function ChatScreen() {
  const { reservaId } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [mensajes, setMensajes] = useState<any[]>([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [miIdioma, setMiIdioma] = useState("es");
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    inicializarChat();
    
    const channel = supabase
      .channel(`chat_${reservaId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "mensajes",
          filter: `reserva_id=eq.${reservaId}`,
        },
        (payload) => {
          setMensajes((prev) => [...prev, payload.new]);
          setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [reservaId]);

  const inicializarChat = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);

      // Cargar mi idioma preferido
      const { data: pData } = await supabase.from("perfiles").select("idioma").eq("id", user?.id).single();
      if (pData) setMiIdioma(pData.idioma || "es");

      const { data, error } = await supabase
        .from("mensajes")
        .select("*")
        .eq("reserva_id", reservaId)
        .order("created_at", { ascending: true });

      if (!error) {
        setMensajes(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setTimeout(() => flatListRef.current?.scrollToEnd(), 500);
    }
  };

  const enviarMensaje = async () => {
    if (!nuevoMensaje.trim() || !userId) return;
    const texto = nuevoMensaje;
    setNuevoMensaje("");

    const { error } = await supabase.from("mensajes").insert([
      {
        reserva_id: reservaId,
        emisor_id: userId,
        contenido: texto,
        idioma_origen: miIdioma, // Guardamos en qué idioma se envió
      },
    ]);

    if (error) {
      setNuevoMensaje(texto);
      return;
    }

    // Notificar al otro usuario
    notificarReceptor(texto);
  };

  const notificarReceptor = async (texto: string) => {
    try {
      const { data: reserva } = await supabase
        .from("reservas")
        .select("user_id, prestador_id")
        .eq("id", reservaId)
        .single();

      if (!reserva) return;

      const receptorId = userId === reserva.user_id ? reserva.prestador_id : reserva.user_id;
      if (!receptorId) return;

      const { data: perfilReceptor } = await supabase
        .from("perfiles")
        .select("push_token")
        .eq("id", receptorId)
        .single();

      if (perfilReceptor?.push_token) {
        await sendPushNotification(
          perfilReceptor.push_token,
          "Nuevo mensaje en TrajinerApp",
          texto.substring(0, 60) + (texto.length > 60 ? "..." : ""),
          { reservaId }
        );
      }
    } catch (err) {
      console.log("Error notification:", err);
    }
  };

  const traducirMensaje = async (id: string, texto: string) => {
    let traduccion = "Traduciendo...";
    setMensajes(prev => prev.map(m => m.id === id ? { ...m, traduciendo: true } : m));

    setTimeout(() => {
      const labels: any = {
        en: 'Translated', it: 'Tradotto', zh: '翻译', ja: '翻訳済み',
        ru: 'Переведено', fi: 'Käännetty', pt: 'Traduzido', fr: 'Traduit', es: 'Traducido'
      };
      const label = labels[miIdioma] || 'Translated';
      traduccion = `[${label}] ${texto}`;
      setMensajes(prev => prev.map(m => m.id === id ? { ...m, contenido_traducido: traduccion, traduciendo: false } : m));
    }, 800);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#F8D36B" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.screen} 
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={100}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Chat del Viaje</Text>
          <Text style={styles.subtitle}>Traducción activa: {miIdioma.toUpperCase()}</Text>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={mensajes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const esMio = item.emisor_id === userId;
          return (
            <View style={[styles.messageBubble, esMio ? styles.myMessage : styles.theirMessage]}>
              <Text style={[styles.messageText, esMio ? styles.myText : styles.theirText]}>
                {item.contenido_traducido || item.contenido}
              </Text>
              
              {!esMio && !item.contenido_traducido && (
                <TouchableOpacity onPress={() => traducirMensaje(item.id, item.contenido)}>
                  <Text style={styles.translateLink}>
                    {item.traduciendo ? "Traduciendo..." : "🌐 Traducir"}
                  </Text>
                </TouchableOpacity>
              )}

              <View style={styles.msgFooter}>
                {item.contenido_traducido && <Text style={styles.translatedTag}>Traducción por AI</Text>}
                <Text style={styles.timeText}>
                  {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            </View>
          );
        }}
      />

      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          value={nuevoMensaje}
          onChangeText={setNuevoMensaje}
          placeholder="Escribe un mensaje..."
          placeholderTextColor="#666"
          multiline
        />
        <TouchableOpacity style={styles.sendBtn} onPress={enviarMensaje}>
          <Text style={styles.sendBtnText}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#000" },
  center: { flex: 1, backgroundColor: "#000", justifyContent: "center", alignItems: "center" },
  header: { 
    paddingTop: 60, 
    paddingHorizontal: 20, 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#111",
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#222"
  },
  backBtn: { marginRight: 15 },
  backBtnText: { color: "#F8D36B", fontSize: 24, fontWeight: "900" },
  title: { fontSize: 20, fontWeight: "900", color: "#fff" },
  subtitle: { fontSize: 10, color: "#666", fontWeight: "700" },
  list: { padding: 20, paddingBottom: 40 },
  messageBubble: {
    maxWidth: "85%",
    padding: 15,
    borderRadius: 22,
    marginBottom: 12,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#F8D36B",
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#1A1A1A",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#333",
  },
  messageText: { fontSize: 16, lineHeight: 22 },
  myText: { color: "#000", fontWeight: "600" },
  theirText: { color: "#fff" },
  msgFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  translateLink: { color: "#F8D36B", fontSize: 11, fontWeight: "900", marginTop: 8, textDecorationLine: 'underline' },
  translatedTag: { fontSize: 9, color: "#666", fontStyle: 'italic' },
  timeText: { fontSize: 10, color: "#666" },
  inputArea: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: "#111",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#222",
  },
  input: {
    flex: 1,
    backgroundColor: "#000",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    color: "#fff",
    fontSize: 16,
    maxHeight: 100,
  },
  sendBtn: {
    marginLeft: 15,
    backgroundColor: "#F8D36B",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  sendBtnText: { fontSize: 20, color: "#000" },
});
