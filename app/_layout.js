// app/_layout.js
import React, { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { EmergencyProvider, useEmergency } from "../contexts/EmergencyContext"; // Ajuste o caminho se necessário
import useCachedResources from "../hooks/useCachedResources"; // Ajuste o caminho
import Colors from "../constants/Colors"; // Ajuste o caminho

const theme = Colors.light;

function RootNavigation() {
  const router = useRouter();
  const segments = useSegments(); // Para saber a rota atual
  const { isEmergencyActive } = useEmergency(); // Obtém do contexto

  useEffect(() => {
    const isInEmergencyScreen = segments.includes("emergency");

    if (isEmergencyActive && !isInEmergencyScreen) {
      router.replace("/emergency"); // Navega para a tela de emergência
    } else if (!isEmergencyActive && isInEmergencyScreen) {
      router.replace("/(tabs)/home"); // Volta para home se a emergência for cancelada
    }
  }, [isEmergencyActive, segments, router]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="emergency"
        options={{
          presentation: "modal", // Ou 'fullScreenModal'
          gestureEnabled: false // Impedir de fechar a tela de emergência com gesto
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null; // Ou um componente de Splash Screen
  }

  return (
    <SafeAreaProvider>
      <EmergencyProvider>
        <RootNavigation />
        <StatusBar
          style={theme === Colors.dark ? "light" : "dark"}
          backgroundColor={theme.background}
        />
      </EmergencyProvider>
    </SafeAreaProvider>
  );
}
