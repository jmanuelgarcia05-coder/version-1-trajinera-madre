import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

const supabaseUrl = "https://gvzovqziltwqeorwqgro.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2em92cXppbHR3cWVvcndxZ3JvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4OTQ3NzAsImV4cCI6MjA5MzQ3MDc3MH0.r9169F68DcbJVwwuZwvsiUiQpqA6BMktD2nOBtn4KIA";

const isWeb = Platform.OS === "web";
const isServer = isWeb && typeof window === "undefined";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: isServer ? undefined : AsyncStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: "pkce" // Cambiamos a PKCE, es más robusto para navegadores modernos
  }
});