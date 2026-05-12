import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { supabase } from "../lib/supabase";

export default function CheckoutScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const granTotal = parseFloat(params.total as string || "0");
  const baseTotal = parseFloat(params.baseTotal as string || "0");
  const serviciosTotal = parseFloat(params.serviciosTotal as string || "0");
  const experiencia = params.experiencia as string || "Viaje en Trajinera";
  const reservaId = params.reservaId as string;

  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const handlePayment = async () => {
    if (cardNumber.length < 16 || expiry.length < 4 || cvv.length < 3) {
      Alert.alert("Error", "Por favor completa los datos de la tarjeta.");
      return;
    }

    setLoading(true);

    try {
      // Simulación de procesamiento real con Stripe
      setTimeout(async () => {
        if (reservaId) {
          const { error } = await supabase
            .from("reservas")
            .update({ pagado: true, estado: 'confirmada', monto_total: granTotal })
            .eq("id", reservaId);
          if (error) throw error;
        }

        setLoading(false);
        Alert.alert(
          "💰 ¡Pago Exitoso!",
          `Se han procesado $${granTotal} MXN para tu aventura.`,
          [{ text: "Comenzar Aventura", onPress: () => router.replace("/usuario") }]
        );
      }, 2500);

    } catch (error: any) {
      setLoading(false);
      Alert.alert("Error en el pago", error.message);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backText}>← Volver</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Finalizar Pago</Text>
      <Text style={styles.subtitle}>Resumen de tu experiencia personalizada</Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>{experiencia}</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Costo Trajinera</Text>
          <Text style={styles.detailValue}>${baseTotal}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Servicios a Bordo</Text>
          <Text style={styles.detailValue}>${serviciosTotal}</Text>
        </View>

        <View style={styles.divider} />
        
        <Text style={styles.totalLabel}>TOTAL A PAGAR</Text>
        <Text style={styles.totalAmount}>${granTotal} MXN</Text>
      </View>

      <View style={styles.cardForm}>
        <Text style={styles.label}>Número de Tarjeta</Text>
        <TextInput
          style={styles.input}
          placeholder="0000 0000 0000 0000"
          placeholderTextColor="#444"
          keyboardType="numeric"
          maxLength={16}
          value={cardNumber}
          onChangeText={setCardNumber}
        />

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.label}>Vencimiento</Text>
            <TextInput
              style={styles.input}
              placeholder="MM/YY"
              placeholderTextColor="#444"
              keyboardType="numeric"
              maxLength={5}
              value={expiry}
              onChangeText={setExpiry}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>CVV</Text>
            <TextInput
              style={styles.input}
              placeholder="123"
              placeholderTextColor="#444"
              keyboardType="numeric"
              maxLength={3}
              value={cvv}
              onChangeText={setCvv}
              secureTextEntry
            />
          </View>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.payButton, loading && { opacity: 0.7 }]} 
        onPress={handlePayment}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.payButtonText}>Confirmar y Pagar ${granTotal}</Text>
        )}
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.securityText}>🔒 Pago Seguro Encriptado</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  content: { padding: 25, paddingTop: 60 },
  backBtn: { marginBottom: 20 },
  backText: { color: '#F8D36B', fontWeight: '900' },
  title: { color: "#fff", fontSize: 32, fontWeight: "900" },
  subtitle: { color: "#666", fontSize: 16, marginBottom: 30, fontWeight: "600" },
  summaryCard: { backgroundColor: "#111", padding: 25, borderRadius: 25, borderWidth: 1, borderColor: "#222", marginBottom: 30 },
  summaryTitle: { color: "#F8D36B", fontSize: 20, fontWeight: "900", marginBottom: 20 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  detailLabel: { color: '#666', fontWeight: '700', fontSize: 14 },
  detailValue: { color: '#fff', fontWeight: '900', fontSize: 14 },
  divider: { height: 1, backgroundColor: "#222", marginVertical: 20 },
  totalLabel: { color: "#666", fontSize: 10, fontWeight: "900", textTransform: "uppercase" },
  totalAmount: { color: "#fff", fontSize: 36, fontWeight: "900", marginTop: 5 },
  cardForm: { gap: 20, marginBottom: 40 },
  label: { color: "#888", fontSize: 13, fontWeight: "900", marginBottom: 8 },
  input: { backgroundColor: "#050505", color: "#fff", height: 60, borderRadius: 18, paddingHorizontal: 20, borderWidth: 1, borderColor: "#222" },
  row: { flexDirection: "row" },
  payButton: { backgroundColor: "#F8D36B", height: 65, borderRadius: 20, justifyContent: "center", alignItems: "center" },
  payButtonText: { color: "#000", fontSize: 18, fontWeight: "900" },
  footer: { marginTop: 30, alignItems: 'center' },
  securityText: { color: "#444", fontSize: 12, fontWeight: "700" }
});
