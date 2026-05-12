import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ImageBackground, 
  TouchableOpacity, 
  Dimensions,
  ActivityIndicator
} from "react-native";
import { supabase } from "../lib/supabase";
import { StatusBar } from "expo-status-bar";

const { width, height } = Dimensions.get("window");

export default function LandingPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Si ya hay sesión, podemos saltar al selector o quedarnos aquí
        // Por ahora dejamos que el usuario vea la landing y decida entrar
      }
      setChecking(false);
    };
    checkAuth();
  }, []);

  const handleStart = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      router.replace("/selector");
    } else {
      router.replace("/login");
    }
  };

  if (checking) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#F8D36B" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ImageBackground
        source={require("../../assets/images/hero.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.content}>
            <Text style={styles.brand}>TrajinerApp</Text>
            <Text style={styles.title}>Vive la magia de{"\n"}Xochimilco</Text>
            <Text style={styles.subtitle}>
              Reserva tu trajinera de lujo, personaliza tu experiencia y navega por los canales ancestrales.
            </Text>

            <TouchableOpacity style={styles.button} onPress={handleStart}>
              <Text style={styles.buttonText}>Comenzar Aventura</Text>
            </TouchableOpacity>

            <Text style={styles.footer}>Explore • Relax • Tradition</Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, backgroundColor: "#050505", justifyContent: "center", alignItems: "center" },
  background: { width, height },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)", // Oscurece un poco la imagen para que el texto resalte
    justifyContent: "flex-end",
    paddingBottom: 80,
  },
  content: {
    paddingHorizontal: 30,
  },
  brand: {
    color: "#F8D36B",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  title: {
    color: "#fff",
    fontSize: 48,
    fontWeight: "900",
    lineHeight: 54,
  },
  subtitle: {
    color: "#ddd",
    fontSize: 18,
    marginTop: 20,
    marginBottom: 40,
    lineHeight: 26,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#F8D36B",
    height: 64,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#F8D36B",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  buttonText: {
    color: "#000",
    fontSize: 20,
    fontWeight: "900",
  },
  footer: {
    color: "rgba(255,255,255,0.5)",
    textAlign: "center",
    marginTop: 40,
    fontSize: 12,
    letterSpacing: 4,
    textTransform: "uppercase",
  },
});