import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";

const CATALOGO = [
  { id: 'm1', categoria: 'Música', nombre: 'Mariachi (1 Hora)', precio: 3500, emoji: '🎻', desc: 'El alma de Xochimilco.' },
  { id: 'm2', categoria: 'Música', nombre: 'Trío Norteño (5 Cancs)', precio: 500, emoji: '🪗', desc: 'Clásicos festivos.' },
  { id: 'c1', categoria: 'Comida', nombre: 'Orden de Tacos (5)', precio: 150, emoji: '🌮', desc: 'Pastor, Suadero o Longaniza.' },
  { id: 'c2', categoria: 'Comida', nombre: 'Antojitos', precio: 120, emoji: '🫓', desc: 'Hechos a mano en chinampa.' },
  { id: 'b1', categoria: 'Bebidas', nombre: 'Cubetazo (10 Cervezas)', precio: 600, emoji: '🍻', desc: 'Nacionales bien frías.' },
  { id: 'b2', categoria: 'Bebidas', nombre: 'Botella de Tequila', precio: 1200, emoji: '🍾', desc: 'Incluye complementos.' },
  { id: 's1', categoria: 'Servicios', nombre: 'Parada al Baño', precio: 20, emoji: '🚻', desc: 'Acceso a baños limpios.' },
  { id: 'p1', categoria: 'Extras', nombre: 'Foto Profesional', precio: 800, emoji: '📸', desc: 'Sesión HD en el viaje.' },
];

export default function ServiciosScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const baseTotal = parseFloat(params.baseTotal as string || "0");
  const experiencia = params.experiencia as string || "Viaje en Trajinera";

  const [cantidades, setCantidades] = useState<Record<string, number>>({});

  const modificarCantidad = (id: string, delta: number) => {
    setCantidades(prev => {
      const actual = prev[id] || 0;
      const nueva = Math.max(0, actual + delta);
      return { ...prev, [id]: nueva };
    });
  };

  const calcularServiciosTotal = () => {
    return CATALOGO.reduce((acc, item) => {
      const cant = cantidades[item.id] || 0;
      return acc + (item.precio * cant);
    }, 0);
  };

  const totalItems = Object.values(cantidades).reduce((a, b) => a + b, 0);
  const serviciosTotal = calcularServiciosTotal();
  const granTotal = baseTotal + serviciosTotal;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Personaliza tu Viaje</Text>
        <View style={styles.cartCount}><Text style={styles.cartCountText}>{totalItems}</Text></View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.promo}>Estás planeando: {experiencia}</Text>
        <Text style={styles.priceSub}>Costo base trajinera: ${baseTotal} MXN</Text>

        {['Música', 'Comida', 'Bebidas', 'Servicios', 'Extras'].map(cat => (
          <View key={cat}>
            <Text style={styles.sectionTitle}>{cat.toUpperCase()}</Text>
            {CATALOGO.filter(item => item.categoria === cat).map(item => {
              const cant = cantidades[item.id] || 0;
              return (
                <View key={item.id} style={[styles.card, cant > 0 && styles.cardActive]}>
                  <View style={styles.cardInfo}>
                    <Text style={styles.emoji}>{item.emoji}</Text>
                    <View style={{ flex: 1, marginLeft: 15 }}>
                      <Text style={styles.itemName}>{item.nombre}</Text>
                      <Text style={styles.itemPrice}>${item.precio} c/u</Text>
                    </View>
                  </View>

                  <View style={styles.qtyContainer}>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => modificarCantidad(item.id, -1)}>
                      <Text style={styles.qtyBtnText}>-</Text>
                    </TouchableOpacity>
                    <View style={styles.qtyValBox}><Text style={styles.qtyVal}>{cant}</Text></View>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => modificarCantidad(item.id, 1)}>
                      <Text style={styles.qtyBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.totalLab}>TOTAL A PAGAR</Text>
          <Text style={styles.totalVal}>${granTotal.toLocaleString()}</Text>
        </View>
        <TouchableOpacity 
          style={styles.payBtn}
          onPress={() => router.push({
            pathname: "/checkout",
            params: { 
              total: granTotal,
              baseTotal: baseTotal,
              serviciosTotal: serviciosTotal,
              experiencia: experiencia
            }
          })}
        >
          <Text style={styles.payText}>PAGAR AHORA ➔</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: { paddingTop: 60, paddingHorizontal: 25, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  back: { color: '#F8D36B', fontSize: 24, fontWeight: '900' },
  title: { color: '#fff', fontSize: 18, fontWeight: '900' },
  cartCount: { backgroundColor: '#F8D36B', width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center' },
  cartCountText: { color: '#000', fontSize: 12, fontWeight: '900' },
  scroll: { paddingBottom: 150 },
  promo: { color: '#F8D36B', marginHorizontal: 25, fontSize: 14, fontWeight: '900', marginBottom: 2 },
  priceSub: { color: '#666', marginHorizontal: 25, fontSize: 11, fontWeight: '700', marginBottom: 10 },
  sectionTitle: { color: '#F8D36B', fontSize: 10, fontWeight: '900', marginHorizontal: 25, marginTop: 25, marginBottom: 15, letterSpacing: 2 },
  card: { backgroundColor: '#080808', marginHorizontal: 25, padding: 15, borderRadius: 25, marginBottom: 12, borderWidth: 1, borderColor: '#151515', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardActive: { borderColor: '#F8D36B', backgroundColor: '#111' },
  cardInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  emoji: { fontSize: 24 },
  itemName: { color: '#fff', fontSize: 14, fontWeight: '800' },
  itemPrice: { color: '#666', fontSize: 11, fontWeight: '600', marginTop: 2 },
  qtyContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', borderRadius: 15, padding: 2, borderWidth: 1, borderColor: '#222' },
  qtyBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a1a', borderRadius: 12 },
  qtyBtnText: { color: '#F8D36B', fontSize: 22, fontWeight: '900' },
  qtyValBox: { width: 35, alignItems: 'center' },
  qtyVal: { color: '#fff', fontWeight: '900', fontSize: 16 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#000', padding: 25, paddingBottom: 45, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#222' },
  totalLab: { color: '#666', fontSize: 10, fontWeight: '900' },
  totalVal: { color: '#fff', fontSize: 28, fontWeight: '900' },
  payBtn: { backgroundColor: '#F8D36B', paddingHorizontal: 30, paddingVertical: 18, borderRadius: 20 },
  payText: { color: '#000', fontWeight: '900', fontSize: 16 }
});
