import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform
} from "react-native";
import { Stack } from "expo-router";

import { useEmergency } from "../contexts/EmergencyContext";
import Colors from "../constants/Colors";
import Typography from "../constants/Typography";
import Layout from "../constants/Layout";
import StyledButton from "../components/StyledButton";
import Icon from "../components/Icon";

const theme = Colors.light;

export default function EmergencyScreen() {
  const {
    cancelEmergency,
    currentLocation,
    isEmergencyActive,
    proximityAlert
  } = useEmergency();

  const activeAlertSource = isEmergencyActive
    ? "PÂNICO"
    : proximityAlert.isActive
    ? "PROXIMIDADE"
    : "INDEFINIDO";
  const aggressorInfo =
    proximityAlert.isActive && proximityAlert.aggressor
      ? `Agressor: ${
          proximityAlert.aggressor.name
        } (${proximityAlert.aggressor.distance?.toFixed(0)}m)`
      : null;

  const handleCancelEmergency = () => {
    cancelEmergency();
  };

  return (
    <>
      {/* Configura o header desta tela específica da Stack */}
      <Stack.Screen
        options={{
          headerShown: true,
          title:
            activeAlertSource === "PÂNICO"
              ? "EMERGÊNCIA ATIVA"
              : "ALERTA DE PROXIMIDADE",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: theme.danger },
          headerTintColor: theme.white,
          headerLeft: () => null,
          gestureEnabled: false // Impede de fechar com gesto
        }}
      />
      <View style={styles.container}>
        <Icon
          name={
            activeAlertSource === "PÂNICO"
              ? "alert-circle-sharp"
              : "warning-sharp"
          }
          size={Layout.iconSize.l * 2.5}
          color={theme.white}
          style={styles.mainIcon}
        />

        <Text style={styles.title}>
          {activeAlertSource === "PÂNICO"
            ? "ALERTA DE PÂNICO ATIVADO!"
            : "ALERTA DE PROXIMIDADE DETECTADO!"}
        </Text>

        <ActivityIndicator
          size={Platform.OS === "ios" ? "large" : 60}
          color={theme.white}
          style={styles.loader}
        />

        <Text style={styles.statusText}>
          {activeAlertSource === "PÂNICO"
            ? "Sua localização está sendo compartilhada com a Delegacia da Mulher (Simulado) e seus contatos de emergência foram notificados."
            : `Atenção! ${
                aggressorInfo || "Um agressor monitorado"
              } está próximo.`}
        </Text>

        {currentLocation && (
          <Text style={styles.locationText}>
            Sua Localização Atual: Lat {currentLocation.latitude.toFixed(4)},
            Lon {currentLocation.longitude.toFixed(4)}
          </Text>
        )}

        <Text style={styles.instruction}>
          Mantenha-se em segurança, se possível. Procure ajuda ou um local
          seguro imediatamente.
        </Text>

        {isEmergencyActive && ( // Só mostrar o botão de cancelar se for um pânico principal
          <StyledButton
            title="ESTOU BEM / CANCELAR ALERTA"
            onPress={handleCancelEmergency}
            variant="success"
            iconLeft="checkmark-circle-outline"
            style={styles.cancelButton}
            textStyle={styles.cancelButtonText}
            size="large"
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Layout.spacing.l,
    paddingBottom: Layout.spacing.xl,
    backgroundColor: theme.danger
  },
  mainIcon: {
    marginBottom: Layout.spacing.m
  },
  title: {
    ...Typography.h1,
    fontFamily: Typography.fontFamilyBold,
    color: theme.white,
    textAlign: "center",
    marginBottom: Layout.spacing.m
  },
  loader: {
    marginVertical: Layout.spacing.l
  },
  statusText: {
    ...Typography.body1,
    fontSize: 17,
    lineHeight: Typography.body1.lineHeight + 6,
    color: theme.white,
    textAlign: "center",
    marginBottom: Layout.spacing.s
  },
  locationText: {
    ...Typography.body2,
    color: theme.lightGrey,
    textAlign: "center",
    marginBottom: Layout.spacing.l,
    fontStyle: "italic"
  },
  instruction: {
    ...Typography.body1,
    fontSize: 16,
    color: theme.white,
    textAlign: "center",
    marginBottom: Layout.spacing.xl + Layout.spacing.m,
    fontWeight: "500"
  },
  cancelButton: {
    width: "100%",
    backgroundColor: theme.success,
    borderColor: theme.white,
    borderWidth: 2
  },
  cancelButtonText: {
    color: theme.white,
    fontFamily: Typography.fontFamilyBold
  }
});
