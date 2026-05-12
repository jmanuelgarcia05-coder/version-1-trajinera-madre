import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

export default function ConfirmacionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const total = Number(params.total) || 1200;
  
  const [numPersonas, setNumPersonas] = useState(2);
  const cuota = (total / numPersonas).toFixed(2);

  const compartirDivision = async () => {
    try {
      await Share.share({
        message: `¡Listo! Ya reservé la trajinera. Somos ${numPersonas} personas y nos toca de $${cuota} cada quien. ¡A darle! 🛶🌮🍻`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* HEADER DE ÉXITO */}
        <View style={styles.header}>
          <Text style={styles.successEmoji}>🛶✨</Text>
          <Text style={styles.title}>¡RESERVA CONFIRMADA!</Text>
          <Text style={styles.subtitle}>Tu aventura en Xochimilco está lista.</Text>
        </View>

        {/* CALCULADORA DE DIVISIÓN */}
        <View style={styles.splitCard}>
          <Text style={styles.splitTitle}>DIVIDIR LA CUENTA</Text>
          <View style={styles.splitRow}>
            <Text style={styles.splitLabel}>Personas en el grupo:</Text>
            <View style={styles.counter}>
              <TouchableOpacity onPress={() => setNumPersonas(Math.max(1, numPersonas - 1))} style={styles.countBtn}>
                <Text style={styles.countText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.countVal}>{numPersonas}</Text>
              <TouchableOpacity onPress={() => setNumPersonas(numPersonas + 1)} style={styles.countBtn}>
                <Text style={styles.countText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLab}>NOS TOCA DE:</Text>
            <Text style={styles.priceVal}>${cuota} MXN</Text>
          </View>
          <TouchableOpacity style={styles.shareSplitBtn} onPress={compartirDivision}>
            <Text style={styles.shareSplitText}>📲 COBRAR A AMIGOS</Text>
          </TouchableOpacity>
        </View>

        {/* BOTONES DE ACCIÓN */}
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.partyBtn}
            onPress={() => router.push("/invitacion")}
          >
            <Text style={styles.partyBtnText}>🎉 IR AL PARTY MODE</Text>
            <Text style={styles.partyBtnSub}>Deja que elijan su comida y bebida</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.backBtn}
            onPress={() => router.replace("/usuario")}
          >
            <Text style={styles.backBtnText}>Volver al Inicio</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  scroll: { padding: 25, paddingBottom: 100 },
  header: { alignItems: 'center', marginBottom: 30, marginTop: 40 },
  successEmoji: { fontSize: 50, marginBottom: 15 },
  title: { color: '#F8D36B', fontSize: 22, fontWeight: '900', letterSpacing: 1 },
  subtitle: { color: '#666', fontSize: 14, marginTop: 5, textAlign: 'center' },
  splitCard: { backgroundColor: '#080808', borderRadius: 30, padding: 25, borderWidth: 1, borderColor: '#222', marginBottom: 30 },
  splitTitle: { color: '#444', fontSize: 10, fontWeight: '900', letterSpacing: 2, marginBottom: 20 },
  splitRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  splitLabel: { color: '#fff', fontSize: 14, fontWeight: '700' },
  counter: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', borderRadius: 15, padding: 5 },
  countBtn: { width: 35, height: 35, borderRadius: 10, backgroundColor: '#222', justifyContent: 'center', alignItems: 'center' },
  countText: { color: '#F8D36B', fontSize: 20, fontWeight: '900' },
  countVal: { color: '#fff', fontSize: 16, fontWeight: '900', marginHorizontal: 15 },
  priceRow: { marginTop: 25, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#111', alignItems: 'center' },
  priceLab: { color: '#444', fontSize: 9, fontWeight: '900' },
  priceVal: { color: '#00E676', fontSize: 32, fontWeight: '900', marginTop: 5 },
  shareSplitBtn: { backgroundColor: '#111', marginTop: 20, padding: 15, borderRadius: 15, alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  shareSplitText: { color: '#fff', fontSize: 12, fontWeight: '900' },
  actions: { gap: 15 },
  partyBtn: { backgroundColor: '#F8D36B', padding: 25, borderRadius: 25, alignItems: 'center' },
  partyBtnText: { color: '#000', fontSize: 16, fontWeight: '900' },
  partyBtnSub: { color: 'rgba(0,0,0,0.5)', fontSize: 10, fontWeight: '700', marginTop: 4 },
  backBtn: { padding: 15, alignItems: 'center' },
  backBtnText: { color: '#444', fontWeight: '800' }
});
