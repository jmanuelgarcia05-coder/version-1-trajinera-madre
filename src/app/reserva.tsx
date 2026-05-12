import { Link, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Linking,
} from "react-native";
import { supabase } from "../lib/supabase";

const PRECIO_BASE_HORA = 750;

const EXTRAS = [
  { id: "bano", nombre: "Baños", precio: 50 },
  { id: "comida", nombre: "Comida", precio: 250 },
  { id: "guia", nombre: "Guía de turistas", precio: 400 },
  { id: "mariachi", nombre: "Mariachi", precio: 1200 },
  { id: "fotografo", nombre: "Fotógrafo", precio: 800 },
];

const EXPERIENCIAS = [
  "Canal turístico con mariachi",
  "Isla de las Muñecas",
  "Ajolotario",
  "Chinampa productora",
  "Laguna de Xaltocan",
  "La Llorona",
];

export default function ReservaScreen() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [horas, setHoras] = useState("1");
  const [experiencia, setExperiencia] = useState(EXPERIENCIAS[0]);
  const [extrasSeleccionados, setExtrasSeleccionados] = useState<string[]>([]);
  const [guardando, setGuardando] = useState(false);

  const horasNum = useMemo(() => {
    const n = Number(horas);
    return n > 0 ? n : 1;
  }, [horas]);

  const precioBase = useMemo(() => {
    return PRECIO_BASE_HORA * horasNum;
  }, [horasNum]);

  const extrasTotal = useMemo(() => {
    let totalExtras = 0;

    extrasSeleccionados.forEach((id) => {
      const extra = EXTRAS.find((e) => e.id === id);

      if (extra) {
        totalExtras += extra.precio;
      }
    });

    return totalExtras;
  }, [extrasSeleccionados]);

  const total = useMemo(() => {
    return Number(precioBase) + Number(extrasTotal);
  }, [precioBase, extrasTotal]);

  function toggleExtra(id: string) {
    setExtrasSeleccionados((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }

      return [...prev, id];
    });
  }

  function obtenerExtrasTexto() {
    const nombres = EXTRAS.filter((extra) =>
      extrasSeleccionados.includes(extra.id)
    ).map((extra) => `${extra.nombre} ($${extra.precio})`);

    return nombres.length > 0 ? JSON.stringify(nombres) : "[]";
  }

  async function guardarReserva() {
    if (!nombre.trim() || !telefono.trim() || !fecha.trim() || !hora.trim()) {
      Alert.alert("Faltan datos", "Completa nombre, teléfono, fecha y hora.");
      return;
    }

    const precioBaseFinal = Number(precioBase);
    const extrasTotalFinal = Number(extrasTotal);
    const totalFinal = precioBaseFinal + extrasTotalFinal;
    const extrasTexto = obtenerExtrasTexto();

    setGuardando(true);

    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user.id;

    if (!userId) {
      Alert.alert("Error", "Debes iniciar sesión para reservar.");
      setGuardando(false);
      return;
    }

    const { error } = await supabase.from("reservas").insert([
      {
        nombre: nombre.trim(),
        telefono: telefono.trim(),
        fecha: fecha.trim(),
        hora: hora.trim(),
        horas: horasNum,
        experiencia,
        extras: extrasTexto,
        precio_base: precioBaseFinal,
        extras_total: extrasTotalFinal,
        total: totalFinal,
        estado: "pendiente",
        user_id: userId,
      },
    ]);

    setGuardando(false);

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    const mensaje = `¡Hola! He realizado una reserva en TrajinerApp:%0A%0A` +
      `*Cliente:* ${nombre.trim()}%0A` +
      `*Fecha:* ${fecha.trim()}%0A` +
      `*Hora:* ${hora.trim()}%0A` +
      `*Horas:* ${horasNum}%0A` +
      `*Experiencia:* ${experiencia}%0A` +
      `*Total:* $${totalFinal} MXN%0A%0A` +
      `¿Podría confirmar mi reserva?`;

    Alert.alert(
      "Reserva creada",
      `Total: $${totalFinal} MXN\n\n¿Cómo deseas confirmar tu reserva?`,
      [
        {
          text: "Pagar con Tarjeta",
          onPress: () => {
            router.push({
              pathname: "/checkout",
              params: { total: totalFinal, nombre: nombre.trim() }
            });
            resetForm();
          }
        },
        {
          text: "WhatsApp (Enviar comprobante)",
          onPress: () => {
            const telPrestador = "525500000000"; 
            Linking.openURL(`https://wa.me/${telPrestador}?text=${mensaje}`);
            resetForm();
          }
        },
        {
          text: "Después",
          onPress: () => resetForm(),
          style: "cancel"
        }
      ]
    );
  }

  function resetForm() {
    setNombre("");
    setTelefono("");
    setFecha("");
    setHora("");
    setHoras("1");
    setExperiencia(EXPERIENCIAS[0]);
    setExtrasSeleccionados([]);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Reservar trajinera</Text>
      <Text style={styles.subtitle}>Base: $750 MXN por hora</Text>

      <Link href="/" asChild>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backText}>Volver al inicio</Text>
        </TouchableOpacity>
      </Link>

      <View style={styles.card}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          value={nombre}
          onChangeText={setNombre}
          placeholder="Nombre del cliente"
          placeholderTextColor="#777"
          style={styles.input}
        />

        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          value={telefono}
          onChangeText={setTelefono}
          placeholder="Teléfono"
          placeholderTextColor="#777"
          keyboardType="phone-pad"
          style={styles.input}
        />

        <Text style={styles.label}>Fecha</Text>
        <TextInput
          value={fecha}
          onChangeText={setFecha}
          placeholder="2026-05-09"
          placeholderTextColor="#777"
          style={styles.input}
        />

        <Text style={styles.label}>Hora</Text>
        <TextInput
          value={hora}
          onChangeText={setHora}
          placeholder="14:00"
          placeholderTextColor="#777"
          style={styles.input}
        />

        <Text style={styles.label}>Horas</Text>
        <TextInput
          value={horas}
          onChangeText={setHoras}
          placeholder="1"
          placeholderTextColor="#777"
          keyboardType="numeric"
          style={styles.input}
        />
      </View>

      <Text style={styles.sectionTitle}>Experiencia</Text>

      {EXPERIENCIAS.map((item) => (
        <TouchableOpacity
          key={item}
          style={[
            styles.option,
            experiencia === item && styles.optionSelected,
          ]}
          onPress={() => setExperiencia(item)}
        >
          <Text
            style={[
              styles.optionText,
              experiencia === item && styles.optionTextSelected,
            ]}
          >
            {item}
          </Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.sectionTitle}>Extras</Text>

      {EXTRAS.map((extra) => {
        const selected = extrasSeleccionados.includes(extra.id);

        return (
          <TouchableOpacity
            key={extra.id}
            style={[styles.extraCard, selected && styles.extraSelected]}
            onPress={() => toggleExtra(extra.id)}
          >
            <View>
              <Text style={styles.extraName}>{extra.nombre}</Text>
              <Text style={styles.extraPrice}>+ ${extra.precio} MXN</Text>
            </View>

            <Text style={styles.check}>{selected ? "✓" : "+"}</Text>
          </TouchableOpacity>
        );
      })}

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Resumen de cobro</Text>
        <Text style={styles.totalLine}>Base: ${precioBase} MXN</Text>
        <Text style={styles.totalLine}>Extras: ${extrasTotal} MXN</Text>
        <Text style={styles.total}>Total: ${total} MXN</Text>
      </View>

      <TouchableOpacity
        style={[styles.saveButton, guardando && styles.disabled]}
        onPress={guardarReserva}
        disabled={guardando}
      >
        <Text style={styles.saveText}>
          {guardando ? "Guardando..." : "Guardar reserva"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#050505" },
  content: { padding: 18, paddingTop: 60 },

  title: {
    color: "#F8D36B",
    fontSize: 32,
    fontWeight: "900",
  },

  subtitle: {
    color: "#fff",
    marginTop: 6,
    marginBottom: 20,
  },

  backButton: {
    backgroundColor: "#151515",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 16,
  },

  backText: {
    color: "#fff",
    fontWeight: "900",
  },

  card: {
    backgroundColor: "#111",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    marginBottom: 20,
  },

  label: {
    color: "#F8D36B",
    fontWeight: "900",
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#1A1A1A",
    color: "#fff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#333",
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 12,
    marginTop: 8,
  },

  option: {
    backgroundColor: "#111",
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    marginBottom: 10,
  },

  optionSelected: {
    backgroundColor: "#F8D36B",
    borderColor: "#F8D36B",
  },

  optionText: {
    color: "#fff",
    fontWeight: "800",
  },

  optionTextSelected: {
    color: "#050505",
    fontWeight: "900",
  },

  extraCard: {
    backgroundColor: "#111",
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  extraSelected: {
    borderColor: "#00E676",
    backgroundColor: "#102015",
  },

  extraName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
  },

  extraPrice: {
    color: "#00E676",
    marginTop: 4,
    fontWeight: "800",
  },

  check: {
    color: "#F8D36B",
    fontSize: 28,
    fontWeight: "900",
  },

  totalCard: {
    backgroundColor: "#F8D36B",
    borderRadius: 20,
    padding: 18,
    marginTop: 16,
    marginBottom: 16,
  },

  totalLabel: {
    color: "#050505",
    fontWeight: "900",
    fontSize: 16,
  },

  totalLine: {
    color: "#050505",
    fontWeight: "800",
    marginTop: 6,
  },

  total: {
    color: "#050505",
    fontSize: 28,
    fontWeight: "900",
    marginTop: 8,
  },

  saveButton: {
    backgroundColor: "#00E676",
    padding: 17,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 40,
  },

  disabled: {
    opacity: 0.6,
  },

  saveText: {
    color: "#050505",
    fontSize: 17,
    fontWeight: "900",
  },
});