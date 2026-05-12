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

// Nota: En producción, deberás instalar @stripe/stripe-react-native
// y configurar el StripeProvider en tu App.tsx / _layout.tsx

export default function CheckoutScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { total, nombre, experiencia, reservaId } = params;
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
      // 1. Aquí llamaríamos a tu Edge Function de Supabase para crear el PaymentIntent
      // const { data, error } = await supabase.functions.invoke('create-payment-intent', { body: { amount: total } });
      
      // 2. Simulación de procesamiento real con Stripe
      setTimeout(async () => {
        // Marcamos la reserva como pagada en la base de datos
        if (reservaId) {
          const { error: updateError } = await supabase
            .from("reservas")
            .update({ pagado: true, estado: 'confirmada' })
            .eq("id", reservaId);
            
          if (updateError) throw updateError;
        }

        setLoading(false);
        Alert.alert(
          "💰 ¡Pago Exitoso!",
          `Se han procesado $${total} MXN para tu experiencia: ${experiencia}.`,
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
      <Text style={styles.title}>Finalizar Pago</Text>
      <Text style={styles.subtitle}>Confirma los detalles de tu aventura</Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>{experiencia}</Text>
        <Text style={styles.summaryDetail}>👤 Para: {nombre}</Text>
        <View style={styles.divider} />
        <Text style={styles.totalLabel}>Total a pagar</Text>
        <Text style={styles.totalAmount}>${total} MXN</Text>
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
          <Text style={styles.payButtonText}>Confirmar y Pagar</Text>
        )}
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.securityText}>🔒 Encriptación SSL de 256 bits</Text>
        <Text style={styles.stripeText}>Powered by STRIPE</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  content: { padding: 25, paddingTop: 60 },
  title: { color: "#fff", fontSize: 32, fontWeight: "900" },
  subtitle: { color: "#666", fontSize: 16, marginBottom: 30, fontWeight: "600" },
  summaryCard: {
    backgroundColor: "#111",
    padding: 25,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#222",
    marginBottom: 30,
  },
  summaryTitle: { color: "#F8D36B", fontSize: 22, fontWeight: "900", marginBottom: 5 },
  summaryDetail: { color: "#888", fontSize: 14, fontWeight: "600" },
  divider: { height: 1, backgroundColor: "#222", marginVertical: 20 },
  totalLabel: { color: "#666", fontSize: 12, fontWeight: "900", textTransform: "uppercase" },
  totalAmount: { color: "#fff", fontSize: 38, fontWeight: "900", marginTop: 5 },
  cardForm: { gap: 20, marginBottom: 40 },
  label: { color: "#888", fontSize: 13, fontWeight: "900", marginBottom: 8, marginLeft: 5 },
  input: {
    backgroundColor: "#050505",
    color: "#fff",
    height: 60,
    borderRadius: 18,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#222",
    fontSize: 16,
  },
  row: { flexDirection: "row" },
  payButton: {
    backgroundColor: "#F8D36B",
    height: 65,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#F8D36B",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  payButtonText: { color: "#000", fontSize: 18, fontWeight: "900" },
  footer: { marginTop: 30, alignItems: 'center' },
  securityText: { color: "#444", fontSize: 12, fontWeight: "700" },
  stripeText: { color: "#6772E5", fontSize: 14, fontWeight: "900", marginTop: 5, letterSpacing: 1 },
});
