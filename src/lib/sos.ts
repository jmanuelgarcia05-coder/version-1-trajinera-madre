import { Alert, Linking, Platform } from "react-native";

const EMERGENCY_PHONE = "911";

export async function activarSOS() {
  const phoneUrl =
    Platform.OS === "android"
      ? `tel:${EMERGENCY_PHONE}`
      : `telprompt:${EMERGENCY_PHONE}`;

  Alert.alert(
    "SOS activado",
    "Se intentará llamar al 911.",
    [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Llamar 911",
        style: "destructive",
        onPress: async () => {
          const supported = await Linking.canOpenURL(phoneUrl);
          if (supported) {
            await Linking.openURL(phoneUrl);
          } else {
            Alert.alert("Error", "No se pudo abrir la llamada.");
          }
        },
      },
    ]
  );
}
