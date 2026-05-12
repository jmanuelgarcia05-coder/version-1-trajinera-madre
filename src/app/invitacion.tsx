import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
  Image,
} from "react-native";

const CATALOGO_RAPIDO = [
  { id: 'b1', nombre: 'Cerveza Extra', precio: 60, emoji: '🍺' },
  { id: 'c1', nombre: 'Orden Tacos', precio: 150, emoji: '🌮' },
  { id: 'b2', nombre: 'Margarita', precio: 180, emoji: '🍸' },
];

export default function InvitacionGrupalScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [carritoInvitado, setCarritoInvitado] = useState<any[]>([]);

  const tripId = "TRAJ-7892"; // Simulación de ID de viaje
  const shareLink = `https://trajinerapp.com/join/${tripId}`;

  const onShare = async () => {
    try {
      await Share.share({
        message: `¡Te invito a mi trajinera en Xochimilco! 🎉 Navegaremos con el Capitán Don Beto. Únete aquí para elegir tus bebidas y comida: ${shareLink}`,
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  const agregarAlCarrito = (item: any) => {
    setCarritoInvitado([...carritoInvitado, item]);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.emoji}>🎉</Text>
          <Text style={styles.title}>¡Estás Invitado!</Text>
          <Text style={styles.subtitle}>Te unirás a la trajinera de <Text style={{color: '#F8D36B'}}>Manuel</Text></Text>
        </View>

        {/* INFO DEL VIAJE */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View>
              <Text style={styles.infoLab}>DESTINO</Text>
              <Text style={styles.infoVal}>Isla de las Muñecas</Text>
            </View>
            <View>
              <Text style={styles.infoLab}>CAPITÁN</Text>
              <Text style={styles.infoVal}>Don Beto S.</Text>
            </View>
          </View>
        </View>

        {/* MENÚ PARA INVITADOS */}
        <Text style={styles.sectionTitle}>AÑADE TUS ANTOJITOS A LA CUENTA</Text>
        <Text style={styles.sectionDesc}>Lo que elijas se sumará a la cuenta grupal y estará listo al abordar.</Text>

        {CATALOGO_RAPIDO.map(item => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.itemCard}
            onPress={() => agregarAlCarrito(item)}
          >
            <Text style={styles.itemEmoji}>{item.emoji}</Text>
            <View style={{ flex: 1, marginLeft: 15 }}>
              <Text style={styles.itemName}>{item.nombre}</Text>
              <Text style={styles.itemPrice}>${item.precio} MXN</Text>
            </View>
            <View style={styles.addBtn}>
              <Text style={styles.addBtnText}>+ AÑADIR</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* COMPARTIR (BOTÓN MAESTRO) */}
        <View style={styles.shareBox}>
          <Text style={styles.shareTitle}>¿Faltan amigos?</Text>
          <TouchableOpacity style={styles.shareBtn} onPress={onShare}>
            <Text style={styles.shareBtnText}>COMPARTIR LINK DE LA FIESTA ➔</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* RESUMEN INVITADO */}
      {carritoInvitado.length > 0 && (
        <View style={styles.footer}>
          <View>
            <Text style={styles.footLab}>TUS ADICIONES</Text>
            <Text style={styles.footVal}>{carritoInvitado.length} items</Text>
          </View>
          <TouchableOpacity style={styles.confirmBtn} onPress={() => router.replace("/usuario")}>
            <Text style={styles.confirmText}>LISTO ✓</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  scroll: { padding: 25, paddingTop: 80, paddingBottom: 150 },
  header: { alignItems: 'center', marginBottom: 40 },
  emoji: { fontSize: 50, marginBottom: 15 },
  title: { color: '#fff', fontSize: 32, fontWeight: '900' },
  subtitle: { color: '#666', fontSize: 16, marginTop: 5 },
  infoCard: { backgroundColor: '#111', padding: 25, borderRadius: 25, borderWidth: 1, borderColor: '#222', marginBottom: 40 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between' },
  infoLab: { color: '#444', fontSize: 10, fontWeight: '900', letterSpacing: 2, marginBottom: 5 },
  infoVal: { color: '#fff', fontSize: 14, fontWeight: '800' },
  sectionTitle: { color: '#F8D36B', fontSize: 11, fontWeight: '900', marginBottom: 8, letterSpacing: 1 },
  sectionDesc: { color: '#444', fontSize: 12, marginBottom: 25, lineHeight: 18 },
  itemCard: { backgroundColor: '#080808', padding: 20, borderRadius: 25, marginBottom: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#111' },
  itemEmoji: { fontSize: 24 },
  itemName: { color: '#fff', fontSize: 15, fontWeight: '800' },
  itemPrice: { color: '#666', fontSize: 12, marginTop: 2 },
  addBtn: { backgroundColor: '#111', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: '#222' },
  addBtnText: { color: '#F8D36B', fontSize: 10, fontWeight: '900' },
  shareBox: { marginTop: 40, padding: 30, backgroundColor: '#080808', borderRadius: 30, alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#333' },
  shareTitle: { color: '#666', fontSize: 14, fontWeight: '700', marginBottom: 20 },
  shareBtn: { backgroundColor: '#F8D36B', width: '100%', padding: 20, borderRadius: 20, alignItems: 'center' },
  shareBtnText: { color: '#000', fontWeight: '900', fontSize: 15 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#111', padding: 25, paddingBottom: 45, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#222' },
  footLab: { color: '#666', fontSize: 10, fontWeight: '900' },
  footVal: { color: '#fff', fontSize: 24, fontWeight: '900' },
  confirmBtn: { backgroundColor: '#00E676', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 18 },
  confirmText: { color: '#000', fontWeight: '900' }
});
