import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      // Supabase detectará automáticamente la sesión en la URL (gracias a detectSessionInUrl: true)
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error en callback:", error.message);
      }

      if (session) {
        router.replace('/selector');
      } else {
        // Si no hay sesión, esperamos un poco o reintentamos
        setTimeout(() => {
          router.replace('/login');
        }, 1500);
      }
    };

    handleCallback();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#F8D36B" />
      <Text style={styles.text}>Autenticando...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#F8D36B',
    marginTop: 20,
    fontWeight: '900',
    fontSize: 18,
  },
});