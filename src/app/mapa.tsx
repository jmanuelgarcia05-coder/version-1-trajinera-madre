import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import { supabase } from "../lib/supabase";

export default function MapaScreen() {
  const webRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [mapaListo, setMapaListo] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [rol, setRol] = useState<string | null>(null);

  useEffect(() => {
    configurarSesion();
  }, []);

  const configurarSesion = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserId(user.id);
      const { data } = await supabase.from("perfiles").select("rol").eq("id", user.id).single();
      setRol(data?.rol || "usuario");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (mapaListo) {
      cargarUbicacionesIniciales();
      escucharCambiosUbicacion();
    }
  }, [mapaListo]);

  const cargarUbicacionesIniciales = async () => {
    const { data, error } = await supabase.from("ubicaciones_trajineras").select("*");
    if (!error && data) {
      data.forEach(u => actualizarMarcadorEnMapa(u));
    }
  };

  const escucharCambiosUbicacion = () => {
    return supabase
      .channel("mapa_global")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "ubicaciones_trajineras" },
        (payload) => {
          actualizarMarcadorEnMapa(payload.new || payload.old);
        }
      )
      .subscribe();
  };

  const actualizarMarcadorEnMapa = (ubicacion: any) => {
    const js = `
      if (window.updateMarker) {
        window.updateMarker('${ubicacion.id}', ${ubicacion.lat}, ${ubicacion.lng}, '${ubicacion.estado}');
      }
      true;
    `;
    webRef.current?.injectJavaScript(js);
  };

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          html, body, #map { height:100%; margin:0; padding:0; background:#050505; }
          .sos-marker { animation: pulse 1s infinite; }
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.5); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map', { zoomControl: false }).setView([19.285, -99.103], 14);
          var markers = {};

          L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: 'TrajinerApp'
          }).addTo(map);

          window.updateMarker = function(id, lat, lng, estado) {
            var iconHtml = estado === 'sos' ? '<div class="sos-marker" style="font-size:30px;">🚨</div>' : '<div style="font-size:24px;">🚤</div>';
            
            if (markers[id]) {
              markers[id].setLatLng([lat, lng]);
              if (estado === 'sos') markers[id].setIcon(L.divIcon({ html: iconHtml, className: '' }));
            } else {
              markers[id] = L.marker([lat, lng], {
                icon: L.divIcon({ html: iconHtml, className: '', iconSize: [30, 30] })
              }).addTo(map);
            }
          };
        </script>
      </body>
    </html>
  `;

  if (loading) return <View style={styles.center}><ActivityIndicator color="#F8D36B" /></View>;

  return (
    <View style={styles.container}>
      <WebView
        ref={webRef}
        originWhitelist={["*"]}
        source={{ html }}
        style={styles.webview}
        onLoadEnd={() => setMapaListo(true)}
      />
      <View style={styles.overlay}>
        <Text style={styles.mapTitle}>Radar TrajinerApp</Text>
        <Text style={styles.mapSub}>Seguimiento en tiempo real activado</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  webview: { flex: 1 },
  overlay: {
    position: 'absolute',
    top: 60,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F8D36B',
  },
  mapTitle: { color: '#F8D36B', fontWeight: '900', fontSize: 18 },
  mapSub: { color: '#fff', fontSize: 10, opacity: 0.6, marginTop: 2 }
});