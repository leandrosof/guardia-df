import React, { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { EmergencyProvider, useEmergency } from "../contexts/EmergencyContext";
import useCachedResources from "../hooks/useCachedResources";
import Colors from "../constants/Colors";

const theme = Colors.light;

function RootNavigation() {
  const router = useRouter();
  const segments = useSegments();
  const { isEmergencyActive } = useEmergency();

  useEffect(() => {
    const isInEmergencyScreen = segments.includes("emergency");

    if (isEmergencyActive && !isInEmergencyScreen) {
      router.replace("/emergency");
    } else if (!isEmergencyActive && isInEmergencyScreen) {
      router.replace("/(tabs)/home");
    }
  }, [isEmergencyActive, segments, router]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="emergency"
        options={{
          presentation: "modal",
          gestureEnabled: false
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
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
