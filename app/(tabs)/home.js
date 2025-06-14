import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { useEmergency } from "../../contexts/EmergencyContext";
import GlobalStyles from "../../constants/GlobalStyles";
import Colors from "../../constants/Colors";
import Typography from "../../constants/Typography";
import Layout from "../../constants/Layout";
import Icon from "../../components/Icon";

// Dados para os cards de ACESSO RÁPIDO com cores individuais
const quickAccessData = [
  {
    id: "1",
    title: "Ligue 180",
    icon: "call",
    color: "#34B3F1",
    action: () => Linking.openURL("tel:180")
  },
  {
    id: "5",
    title: "Chamada de Vídeo",
    icon: "videocam",
    color: "#FF69B4",
    action: () => console.log("Iniciar chamada de vídeo com a delegacia")
  },
  {
    id: "2",
    title: "Casa da Mulher",
    icon: "home",
    color: "#A076F9",
    action: () =>
      Linking.openURL(
        "https://www.gov.br/mdh/pt-br/navegue-por-temas/politicas-para-mulheres/casa-da-mulher-brasileira"
      )
  },
  {
    id: "3",
    title: "Apoio Legal",
    icon: "shield",
    color: "#F39C12",
    action: () => console.log("Apoio Legal")
  },
  {
    id: "4",
    title: "WhatsApp Ajuda",
    icon: "logo-whatsapp",
    color: "#2ECC71",
    action: () => Linking.openURL("https://wa.me/556196100180")
  }
];

// Dados para a seção "Plano de Segurança" com cores individuais
const safetyPlanData = [
  {
    id: "1",
    text: "Monte um kit de emergência com documentos, dinheiro e chaves.",
    icon: "briefcase",
    color: "#A076F9"
  },
  {
    id: "2",
    text: "Memorize números de telefone importantes (família, amigos, 190).",
    icon: "call",
    color: "#34B3F1"
  },
  {
    id: "3",
    text: "Combine uma palavra ou sinal de segurança com alguém de confiança.",
    icon: "key",
    color: "#F39C12"
  },
  {
    id: "4",
    text: "Documente as agressões (fotos, datas) e guarde em local seguro.",
    icon: "document-text",
    color: "#FF69B4"
  }
];

const theme = Colors.light;

export default function HomeScreen() {
  const router = useRouter();
  const {
    triggerEmergency,
    isEmergencyActive,
    requestPermissionsAndStartLocation
  } = useEmergency();

  useEffect(() => {
    if (typeof requestPermissionsAndStartLocation === "function") {
      requestPermissionsAndStartLocation();
    }
  }, [requestPermissionsAndStartLocation]);

  const handleHelpPress = () => {
    if (!isEmergencyActive) {
      triggerEmergency("Botão de Ajuda no App");
    }
  };

  return (
    <SafeAreaView
      style={[
        GlobalStyles.safeAreaContainer,
        { backgroundColor: theme.background }
      ]}
      edges={["top", "left", "right"]}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.mainContent}>
          {/* --- CABEÇALHO --- */}
          <View style={styles.header}>
            <Image
              source={require("../../assets/logo-global.png")}
              style={styles.logo}
            />
            <Text style={styles.slogan}>
              Sua segurança, a um clique de distância.
            </Text>

            {/* --- BOTÃO DE AJUDA ACOLHEDOR --- */}
            <TouchableOpacity
              style={styles.helpButton}
              onPress={handleHelpPress}
              activeOpacity={0.8}
            >
              <Icon
                name="shield-checkmark"
                size={Layout.iconSize.l * 1.2}
                color={theme.white}
              />
              <Text style={styles.helpButtonMainText}>PRECISA DE AJUDA?</Text>
              <Text style={styles.helpButtonSubText}>
                Toque para solicitar uma viatura
              </Text>
            </TouchableOpacity>
            <Text style={styles.actionInfo}>
              Sua localização será compartilhada e seus contatos de emergência
              notificados.
            </Text>
          </View>

          {/* --- SEÇÃO DE ACESSO RÁPIDO --- */}
          <View style={styles.quickAccessSection}>
            <Text style={styles.sectionTitle}>Acesso Rápido</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickAccessScroll}
            >
              {quickAccessData.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.quickAccessCard}
                  onPress={item.action}
                  activeOpacity={0.8}
                >
                  <Icon
                    name={item.icon}
                    size={Layout.iconSize.l}
                    color={item.color}
                  />
                  <Text style={styles.quickAccessCardTitle}>{item.title}</Text>
                  <Icon
                    name="chevron-forward"
                    size={Layout.iconSize.m}
                    color={theme.mediumGrey}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* --- SEÇÃO PLANO DE SEGURANÇA --- */}
          <View style={styles.safetyPlanSection}>
            <Text style={styles.sectionTitle}>Plano de Segurança</Text>
            {safetyPlanData.map((item) => (
              <View key={item.id} style={styles.planItem}>
                <Icon
                  name={item.icon}
                  size={Layout.iconSize.m}
                  color={item.color}
                />
                <Text style={styles.planText}>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- ESTILOS ATUALIZADOS ---
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1
  },
  mainContent: {
    paddingHorizontal: Layout.spacing.m
  },
  header: {
    alignItems: "center",
    backgroundColor: theme.white,
    borderRadius: Layout.borderRadius.m,
    padding: Layout.spacing.m,
    marginBottom: Layout.spacing.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginTop: Layout.spacing.s
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: Layout.spacing.s
  },
  slogan: {
    ...Typography.body1,
    color: theme.mediumGrey,
    textAlign: "center",
    marginBottom: 10
  },
  actionContainer: {
    width: "100%",
    alignItems: "center",
    backgroundColor: theme.white,
    padding: Layout.spacing.m,
    borderRadius: Layout.borderRadius.m,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: Layout.spacing.xl
  },
  helpButton: {
    backgroundColor: "#E63946",
    width: "100%",
    paddingVertical: Layout.spacing.m,
    borderRadius: Layout.borderRadius.m,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8
  },
  helpButtonMainText: {
    ...Typography.h3,
    fontFamily: Typography.fontFamilyBold,
    color: theme.white,
    marginTop: Layout.spacing.m
  },
  helpButtonSubText: {
    ...Typography.body1,
    color: theme.white,
    opacity: 0.9,
    marginTop: Layout.spacing.xs
  },
  actionInfo: {
    ...Typography.caption,
    color: theme.mediumGrey,
    textAlign: "center",
    marginTop: Layout.spacing.m
  },
  sectionTitle: {
    ...Typography.h4,
    fontFamily: Typography.fontFamilyBold,
    color: theme.text,
    marginBottom: Layout.spacing.m
  },
  quickAccessSection: {
    marginBottom: Layout.spacing.xl
  },
  safetyPlanSection: {
    marginBottom: Layout.spacing.xxl
  },
  planItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.white,
    padding: Layout.spacing.m,
    borderRadius: Layout.borderRadius.m,
    marginBottom: Layout.spacing.s
  },
  planText: {
    ...Typography.body2,
    color: theme.text,
    marginLeft: Layout.spacing.m,
    flexShrink: 1
  },
  quickAccessScroll: {
    paddingLeft: 2,
    paddingVertical: Layout.spacing.s
  },
  quickAccessCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.white,
    borderRadius: Layout.borderRadius.m,
    paddingHorizontal: Layout.spacing.m,
    paddingVertical: Layout.spacing.l,
    width: Layout.window.width * 0.7,
    marginRight: Layout.spacing.m,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4
  },
  quickAccessCardTitle: {
    ...Typography.body1,
    fontFamily: Typography.fontFamilyBold,
    color: theme.text,
    marginLeft: Layout.spacing.m,
    flex: 1
  }
});
