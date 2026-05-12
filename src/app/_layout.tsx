import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [rol, setRol] = useState<string | null>(null);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchRol(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchRol(session.user.id);
      } else {
        setRol(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchRol = async (userId: string) => {
    const { data } = await supabase.from('perfiles').select('rol').eq('id', userId).single();
    if (data) setRol(data.rol);
  };

  useEffect(() => {
    const isProtected = segments[0] === "admin" || segments[0] === "prestador";
    const isAdmin = segments[0] === "admin";
    const isPrestador = segments[0] === "prestador";

    if (isProtected) {
      if (!session) {
        // Si intenta entrar a una ruta protegida sin sesión, va al login
        router.replace("/login");
      } else if (rol) {
        // Validar permisos
        if (isAdmin && rol !== "admin") {
          router.replace("/");
        }
        if (isPrestador && rol !== "prestador" && rol !== "admin") {
          router.replace("/");
        }
      }
    }
  }, [session, rol, segments]);

  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ title: "Inicio" }} />
      <Stack.Screen name="reserva" options={{ title: "Nueva Reserva" }} />
      <Stack.Screen name="login" options={{ title: "Login" }} />
      <Stack.Screen name="usuario" options={{ title: "Panel Usuario" }} />
      <Stack.Screen name="admin" options={{ title: "Admin" }} />
      <Stack.Screen name="prestador" options={{ title: "Prestador" }} />
      <Stack.Screen name="selector" options={{ title: "Selección de Panel" }} />
      <Stack.Screen name="mapa" options={{ title: "Mapa" }} />
      <Stack.Screen name="auth/callback" options={{ title: "Iniciando sesión" }} />
    </Stack>
  );
}