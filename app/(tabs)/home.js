// app/(tabs)/home.js
import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // Use edges se necessário
import { useRouter } from "expo-router"; // Para navegação programática

import { useEmergency } from "../../contexts/EmergencyContext"; // Ajuste o caminho
import GlobalStyles from "../../constants/GlobalStyles"; // Ajuste o caminho
import Colors from "../../constants/Colors"; // Ajuste o caminho
import Typography from "../../constants/Typography"; // Ajuste o caminho
import Layout from "../../constants/Layout"; // Ajuste o caminho
import StyledButton from "../../components/StyledButton"; // Ajuste o caminho
import Icon from "../../components/Icon"; // Ajuste o caminho
import Card from "../../components/Card"; // Ajuste o caminho

const theme = Colors.light;

export default function HomeScreen() {
  const router = useRouter(); // Hook de navegação do Expo Router
  const {
    triggerEmergency,
    simulateVolumePressForPitch,
    isEmergencyActive,
    requestPermissionsAndStartLocation
  } = useEmergency();

  useEffect(() => {
    const requestPerms = async () => {
      await requestPermissionsAndStartLocation();
    };
    requestPerms();
  }, [requestPermissionsAndStartLocation]);

  const handlePanicPress = () => {
    if (!isEmergencyActive) {
      triggerEmergency("Botão de Pânico no App");
      // A navegação para /emergency é gerenciada pelo RootLayout
    }
  };

  return (
    // SafeAreaView pode ser gerenciado pelo _layout.(js|tsx) ou aqui com edges
    <SafeAreaView
      style={[
        GlobalStyles.safeAreaContainer,
        { backgroundColor: theme.background }
      ]}
      edges={["top", "left", "right"]}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Image
            source={require("../../assets/icon.png")}
            style={styles.logo}
          />
          <Text style={styles.appName}>Guardiã DF</Text>
          <Text style={styles.slogan}>
            Sua segurança, a um clique de distância.
          </Text>
        </View>

        <Card style={styles.panicCard}>
          <TouchableOpacity
            style={styles.panicButton}
            onPress={handlePanicPress}
            activeOpacity={0.7}
          >
            <Icon
              name="shield-checkmark"
              size={Layout.iconSize.l * 2}
              color={theme.white}
            />
            <Text style={styles.panicButtonText}>ACIONAR PÂNICO</Text>
          </TouchableOpacity>
          <Text style={styles.panicInfo}>
            Toque no escudo para alerta imediato. Sua localização será
            compartilhada e contatos de emergência notificados.
          </Text>
        </Card>

        <Card style={styles.pitchDemoCard}>
          <Text style={styles.pitchTitle}>Demonstração para o Pitch</Text>
          <StyledButton
            title="Simular 'Botão Guardião'"
            onPress={simulateVolumePressForPitch}
            variant="secondary"
            iconLeft="bluetooth"
            fullWidth
          />
          <Text style={styles.pitchInfo}>
            Pressione para simular o acionamento discreto pelo Botão Guardião
            físico (que ativaria o 'shake' do celular).
          </Text>
        </Card>

        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => router.push("/(tabs)/map")}
          >
            <Icon
              name="map-outline"
              size={Layout.iconSize.l}
              color={theme.tint}
            />
            <Text style={styles.actionText}>Mapa Seguro</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => router.push("/(tabs)/support")}
          >
            <Icon
              name="help-buoy-outline"
              size={Layout.iconSize.l}
              color={theme.tint}
            />
            <Text style={styles.actionText}>Rede de Apoio</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => router.push("/(tabs)/settings")}
          >
            <Icon
              name="settings-outline"
              size={Layout.iconSize.l}
              color={theme.tint}
            />
            <Text style={styles.actionText}>Configurações</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// OS ESTILOS (styles) SÃO OS MESMOS DA HomeScreen.js ANTERIOR.
// Copie e cole o objeto 'styles' da versão anterior aqui.
// Certifique-se que os caminhos para assets, como require('../../../assets/icon.png'), estão corretos
// com base na nova localização do arquivo (app/(tabs)/home.js).

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: Layout.spacing.m,
    paddingBottom: Layout.spacing.xl
  },
  header: {
    alignItems: "center",
    marginTop: Layout.spacing.s, // Reduzido, pois SafeAreaView já dá espaço no topo
    marginBottom: Layout.spacing.l
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginBottom: Layout.spacing.m
  },
  appName: {
    ...Typography.h1,
    color: theme.primary,
    fontWeight: "bold"
  },
  slogan: {
    ...Typography.body1,
    color: theme.mediumGrey,
    marginTop: Layout.spacing.xs
  },
  panicCard: {
    width: "100%",
    alignItems: "center",
    backgroundColor: theme.tint,
    paddingVertical: Layout.spacing.l
  },
  panicButton: {
    backgroundColor: theme.danger,
    width: Layout.window.width * 0.5,
    height: Layout.window.width * 0.5,
    borderRadius: Layout.window.width * 0.25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Layout.spacing.m,
    elevation: 8,
    shadowColor: theme.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4
  },
  panicButtonText: {
    ...Typography.h4,
    fontFamily: Typography.fontFamilyBold,
    color: theme.white,
    marginTop: Layout.spacing.s,
    textAlign: "center"
  },
  panicInfo: {
    ...Typography.caption,
    color: theme.white,
    textAlign: "center",
    paddingHorizontal: Layout.spacing.s
  },
  pitchDemoCard: {
    width: "100%",
    marginTop: Layout.spacing.l,
    alignItems: "center"
  },
  pitchTitle: {
    ...Typography.h4,
    color: theme.text,
    marginBottom: Layout.spacing.m
  },
  pitchInfo: {
    ...Typography.caption,
    color: theme.mediumGrey,
    textAlign: "center",
    marginTop: Layout.spacing.s
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: Layout.spacing.xl
  },
  actionItem: {
    alignItems: "center",
    padding: Layout.spacing.s
  },
  actionText: {
    ...Typography.caption,
    color: theme.tint,
    marginTop: Layout.spacing.xs
  }
});
