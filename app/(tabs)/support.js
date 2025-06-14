// app/(tabs)/support.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Colors from "../../constants/Colors";
import Typography from "../../constants/Typography";
import Layout from "../../constants/Layout";
import GlobalStyles from "../../constants/GlobalStyles";
import Card from "../../components/Card";
import Icon from "../../components/Icon";
import StyledButton from "../../components/StyledButton";

const theme = Colors.light;

const supportServices = [
  {
    id: "deam1",
    name: "DEAM - Delegacia Especial de Atendimento à Mulher (Asa Sul)",
    phone: "197",
    address: "EQS 204/205, Asa Sul",
    type: "DEAM",
    icon: "shield-half-sharp"
  },
  {
    id: "ligue180",
    name: "Ligue 180 - Central de Atendimento à Mulher",
    phone: "180",
    type: "Denúncia Nacional",
    icon: "call-sharp"
  },
  {
    id: "ceam1",
    name: "Centro de Atendimento à Mulher (NOME EXEMPLO)",
    phone: "6132220000",
    address: "SCN Quadra 02 Bloco D, Liberty Mall, Torre A, Sala 216",
    type: "Apoio Psicossocial",
    icon: "people-circle-sharp"
  },
  {
    id: "abrigo1",
    name: "Casa Abrigo (Nome Fictício)",
    phone: "61988776655",
    address: "Informação Sigilosa (Acesso via DEAM)",
    type: "Abrigo Temporário",
    icon: "home-sharp"
  },
  {
    id: "juridico1",
    name: "Núcleo de Assistência Jurídica (Defensoria Pública)",
    phone: "129",
    address: "Consultar unidade mais próxima",
    type: "Apoio Jurídico",
    icon: "reader-sharp"
  }
];

const educationalContent = [
  {
    id: "leiMaria",
    title: "O que é Violência Doméstica? (Lei Maria da Penha)",
    link: "https://www.cnj.jus.br/programas-e-acoes/violencia-contra-a-mulher/lei-maria-da-penha/",
    icon: "book-sharp"
  },
  {
    id: "seusDireitos",
    title: "Conheça Seus Direitos Essenciais",
    link: "https://www.compromissoeatitude.org.br/principais-direitos-das-mulheres-em-situacao-de-violencia-domestica-e-familiar/",
    icon: "bulb-sharp"
  },
  {
    id: "comoDenunciar",
    title: "Passo a Passo: Como Fazer uma Denúncia Segura",
    link: "https://www.gov.br/mdh/pt-br/navegue-por-temas/mulher/ligue-180",
    icon: "megaphone-sharp"
  }
];

export default function SupportScreen() {
  const openLink = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Não é possível abrir este URL: ${url}`);
    }
  };

  const makeCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
    <SafeAreaView
      style={[GlobalStyles.safeAreaContainer, styles.screen]}
      edges={["left", "right", "top"]}
    >
      <ScrollView contentContainerStyle={GlobalStyles.contentContainer}>
        <Text style={[GlobalStyles.titleText, styles.pageTitle]}>
          Rede de Apoio e Informação
        </Text>

        <Text style={styles.sectionHeader}>Diretório de Apoio no DF</Text>
        {supportServices.map((service) => (
          <Card key={service.id} style={styles.serviceCard}>
            <View style={styles.cardHeader}>
              <Icon
                name={service.icon || "information-circle-sharp"}
                size={Layout.iconSize.m}
                color={theme.tint}
                style={styles.cardIcon}
              />
              <Text style={styles.serviceName}>{service.name}</Text>
            </View>
            <Text style={styles.serviceDetail}>
              <Text style={styles.detailLabel}>Tipo:</Text> {service.type}
            </Text>
            {service.address && (
              <Text style={styles.serviceDetail}>
                <Text style={styles.detailLabel}>Endereço:</Text>{" "}
                {service.address}
              </Text>
            )}
            {service.phone && (
              <StyledButton
                title={`Ligar: ${service.phone}`}
                onPress={() => makeCall(service.phone)}
                variant="outline"
                iconLeft="call-outline"
                size="small"
                style={styles.actionButton}
              />
            )}
          </Card>
        ))}

        <Text style={styles.sectionHeader}>Conteúdo Educacional</Text>
        {educationalContent.map((content) => (
          <Card key={content.id} style={styles.serviceCard}>
            <View style={styles.cardHeader}>
              <Icon
                name={content.icon || "library-sharp"}
                size={Layout.iconSize.m}
                color={theme.tint}
                style={styles.cardIcon}
              />
              <Text style={styles.serviceName}>{content.title}</Text>
            </View>
            <StyledButton
              title="Acessar Conteúdo"
              onPress={() => openLink(content.link)}
              variant="outline"
              iconLeft="link-outline"
              size="small"
              style={styles.actionButton}
            />
          </Card>
        ))}

        <Card style={[styles.serviceCard, styles.forumCard]}>
          <View style={styles.cardHeader}>
            <Icon
              name="chatbubbles-sharp"
              size={Layout.iconSize.m}
              color={theme.tint}
              style={styles.cardIcon}
            />
            <Text style={styles.serviceName}>
              Comunidade de Suporte (Fórum)
            </Text>
          </View>
          <Text style={styles.serviceDetail}>
            (Em breve: Um espaço seguro e moderado para troca de experiências,
            apoio mútuo e fortalecimento entre mulheres.)
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.background
  },
  pageTitle: {
    marginBottom: Layout.spacing.l
  },
  sectionHeader: {
    ...Typography.h4,
    color: theme.primary,
    marginTop: Layout.spacing.l,
    marginBottom: Layout.spacing.m
  },
  serviceCard: {
    backgroundColor: theme.cardBackground,
    padding: Layout.spacing.m
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Layout.spacing.s
  },
  cardIcon: {
    marginRight: Layout.spacing.s
  },
  serviceName: {
    ...Typography.body1,
    fontFamily: Typography.fontFamilyBold,
    color: theme.text,
    flexShrink: 1
  },
  serviceDetail: {
    ...Typography.body2,
    color: theme.mediumGrey,
    marginBottom: Layout.spacing.xs,
    lineHeight: Typography.body2.lineHeight + 4
  },
  detailLabel: {
    fontFamily: Typography.fontFamilyMedium,
    color: theme.text
  },
  actionButton: {
    marginTop: Layout.spacing.s
  },
  forumCard: {
    backgroundColor: theme.lightGrey
  }
});
