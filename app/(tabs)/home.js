import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  Dimensions
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { useEmergency } from "../../contexts/EmergencyContext";
import GlobalStyles from "../../constants/GlobalStyles";
import Colors from "../../constants/Colors";
import Typography from "../../constants/Typography";
import Layout from "../../constants/Layout";
import Icon from "../../components/Icon";
import ModalComponent from "../../components/ModalComponent";
import FormularioAvaliacaoRisco from "../../components/FormularioAvaliacaoRisco";

const { width: windowWidth } = Dimensions.get("window");

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
    color: Colors.light.accent,
    action: () => console.log("Iniciar chamada de vídeo com a delegacia")
  },
  {
    id: "2",
    title: "Casa da Mulher",
    icon: "home",
    color: Colors.light.tint,
    action: () =>
      Linking.openURL(
        "https://www.gov.br/mdh/pt-br/navegue-por-temas/politicas-para-mulheres/casa-da-mulher-brasileira"
      )
  },
  {
    id: "3",
    title: "Apoio Legal",
    icon: "shield",
    color: Colors.light.warning,
    action: () => console.log("Apoio Legal")
  },
  {
    id: "4",
    title: "WhatsApp Ajuda",
    icon: "logo-whatsapp",
    color: Colors.light.success,
    action: () => Linking.openURL("https://wa.me/556196100180")
  }
];

// Dados para a seção "Plano de Segurança" com cores individuais
const safetyPlanData = [
  {
    id: "1",
    text: "Monte um kit de emergência com documentos, dinheiro e chaves.",
    icon: "briefcase",
    color: Colors.light.tint
  },
  {
    id: "2",
    text: "Memorize números de telefone importantes (família, amigos, 190).",
    icon: "call",
    color: Colors.light.primary
  },
  {
    id: "3",
    text: "Combine uma palavra ou sinal de segurança com alguém de confiança.",
    icon: "key",
    color: Colors.light.warning
  },
  {
    id: "4",
    text: "Documente as agressões (fotos, datas) e guarde em local seguro.",
    icon: "document-text",
    color: Colors.light.accent
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

  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [formResult, setFormResult] = useState(null);
  const [isResultModalVisible, setIsResultModalVisible] = useState(false); // Novo estado para a modal de resultados

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

  const handleOpenFormModal = () => {
    setIsFormModalVisible(true);
    setFormResult(null); // Limpa resultados anteriores ao abrir o formulário
  };

  const handleFormSubmit = (pontuacao, nivel) => {
    setFormResult({ pontuacao, nivel });
    setIsFormModalVisible(false); // Fecha a modal do formulário
    setIsResultModalVisible(true); // Abre a modal de resultados
  };

  const handleCloseResultModal = () => {
    setIsResultModalVisible(false);
    setFormResult(null); // Reseta o estado do resultado para o formulário "voltar ao inicial"
  };

  // --- FUNÇÃO DE ORIENTAÇÕES SIMPLIFICADA ---
  const getOrientacoes = (nivel) => {
    switch (nivel) {
      case "RISCO EXTREMO":
        return (
          <View>
            <Text style={styles.orientacaoTitle}>
              Atenção! Risco Extremo. Sua segurança é a prioridade!
            </Text>
            <Text style={styles.orientacaoText}>
              Este é um momento de ALERTA MÁXIMO. Busque ajuda AGORA.
            </Text>
            <Text style={styles.orientacaoListItem}>
              • **Busque um lugar seguro:** Vá para casa de um familiar, amigo
              de confiança ou ligue 180 para informações sobre abrigos.
            </Text>
            <Text style={styles.orientacaoListItem}>
              • **Ative o botão de emergência:** Use o botão grande "PRECISA DE
              AJUDA?" na tela inicial para solicitar apoio imediato.
            </Text>
            <Text style={styles.orientacaoListItem}>
              • **Peça ajuda:** Entre em contato com o PROVID/PMDF (Polícia
              Militar do DF) para criar um plano de segurança pessoal e ter
              acompanhamento.
            </Text>
            <Text style={styles.orientacaoListItem}>
              • **Procure apoio profissional:** Busque atendimento psicológico e
              social em Centros da Mulher, CREAS ou outros serviços indicados.
              Eles podem te ajudar e te acompanhar.
            </Text>
            <Text style={styles.orientacaoListItem}>
              • **Prioridade no atendimento:** Você tem prioridade nos serviços
              de proteção. Não hesite em buscar ajuda.
            </Text>
            <Text style={styles.orientacaoListItem}>
              • **Documente tudo:** Guarde provas de agressões ou ameaças
              (mensagens, fotos, datas), se for seguro fazer isso.{" "}
            </Text>
            <Text style={styles.orientacaoText}>
              Lembre-se: Você não está sozinha. Existem pessoas e serviços para
              te proteger.
            </Text>
          </View>
        );
      case "RISCO GRAVE":
        return (
          <View>
            <Text style={styles.orientacaoTitle}>
              Importante! Risco Grave. Fique atenta e se proteja!
            </Text>
            <Text style={styles.orientacaoText}>
              Sua situação exige atenção. É hora de buscar apoio e criar um
              plano de segurança.
            </Text>
            <Text style={styles.orientacaoListItem}>
              • **Considere uma medida protetiva:** Converse com um profissional
              (delegacia, Ministério Público ou Defensoria) sobre solicitar uma
              medida protetiva para se afastar do agressor.
            </Text>
            <Text style={styles.orientacaoListItem}>
              • **Busque apoio psicológico e social:** Centros da Mulher e CREAS
              podem oferecer acompanhamento para você e seus filhos.
            </Text>
            <Text style={styles.orientacaoListItem}>
              • **Se houver descumprimento de medidas protetivas:** Procure a
              polícia ou a justiça imediatamente para que providências sejam
              tomadas.
            </Text>
            <Text style={styles.orientacaoListItem}>
              • **Cuidado com o uso de álcool/drogas:** Se o agressor faz uso
              abusivo, o risco pode aumentar. Busque ajuda para ele ou se
              proteja ainda mais.
            </Text>
            <Text style={styles.orientacaoListItem}>
              • **Apoio jurídico:** Se houver conflitos com relação a filhos ou
              outros assuntos legais, procure assistência jurídica.
            </Text>
            <Text style={styles.orientacaoListItem}>
              • **Pense em um lugar seguro:** Tenha um plano de fuga ou saiba
              para onde ir se precisar sair de casa rapidamente (casa de
              familiar, amigo ou abrigo temporário).
            </Text>
            <Text style={styles.orientacaoText}>
              Sua segurança é um direito. Não hesite em buscar todo o apoio
              necessário.
            </Text>
          </View>
        );
      case "RISCO MODERADO":
        return (
          <View>
            <Text style={styles.orientacaoTitle}>
              Atenção! Risco Moderado. Previna-se e busque apoio!
            </Text>
            <Text style={styles.orientacaoText}>
              Sua situação inspira cuidados. É importante se prevenir e buscar
              apoio para evitar que o risco aumente.
            </Text>
            <Text style={styles.orientacaoListItem}>
              • **Converse sobre medida protetiva:** Avalie a possibilidade de
              solicitar uma medida protetiva para sua segurança.
            </Text>
            <Text style={styles.orientacaoListItem}>
              • **Procure apoio psicossocial:** Serviços como os Centros da
              Mulher podem te ajudar a fortalecer-se e lidar com a situação.
            </Text>
            <Text style={styles.orientacaoListItem}>
              • **Construa seu plano de segurança:** Utilize as dicas da seção
              "Plano de Segurança" na tela inicial do aplicativo para se
              preparar.
            </Text>
            <Text style={styles.orientacaoListItem}>
              • **Fique atenta aos sinais:** Esteja ciente de que a situação
              pode piorar. Se as ameaças ou agressões aumentarem, procure ajuda
              imediatamente.
            </Text>
            <Text style={styles.orientacaoListItem}>
              • **Apoio jurídico:** Se precisar de ajuda com questões legais
              (filhos, bens), procure um advogado ou a Defensoria Pública.
            </Text>
            <Text style={styles.orientacaoText}>
              Buscar ajuda é um ato de coragem e proteção. Não espere a situação
              piorar.
            </Text>
          </View>
        );
      default:
        return (
          <View>
            <Text style={styles.orientacaoTitle}>
              Nível de Risco Identificado: {nivel}
            </Text>
            <Text style={styles.orientacaoText}>
              Seu resultado indica um risco aparentemente baixo, mas a violência
              doméstica pode ser imprevisível. Sua segurança é sempre
              importante.
            </Text>
            <Text style={styles.orientacaoListItem}>
              • **Mantenha-se informada:** Explore as outras seções do
              aplicativo para saber onde buscar ajuda se precisar.
            </Text>
            <Text style={styles.orientacaoListItem}>
              • **Considere o Plano de Segurança:** Mesmo com baixo risco, ter
              um plano de segurança é sempre uma boa prática. Revise as dicas na
              tela inicial.
            </Text>
            <Text style={styles.orientacaoListItem}>
              • **Não hesite em buscar apoio:** Se a situação mudar ou você se
              sentir insegura, procure ajuda imediatamente. Você não está
              sozinha.
            </Text>
            <Text style={styles.orientacaoText}>
              Lembre-se: Poucas respostas positivas no formulário não significam
              que não há necessidade de proteção. Sua percepção é fundamental.
            </Text>
          </View>
        );
    }
  };

  const getRiskColor = (nivel) => {
    switch (nivel) {
      case "RISCO EXTREMO":
        return Colors.light.danger;
      case "RISCO GRAVE":
        return Colors.light.warning;
      case "RISCO MODERADO":
        return Colors.light.tint;
      default:
        return Colors.light.mediumGrey;
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

          {/* --- NOVA SEÇÃO: AVALIAÇÃO DE RISCO EM DESTAQUE --- */}
          <View style={styles.riskAssessmentSection}>
            <Text style={styles.sectionTitle}>
              Conheça seu Risco e Se Proteja
            </Text>
            <Text style={styles.riskAssessmentSubTitle}>
              Responda a algumas perguntas para entender seu nível de risco e
              receber orientações personalizadas para sua segurança.
            </Text>
            <TouchableOpacity
              style={styles.riskAssessmentButton}
              onPress={handleOpenFormModal}
              activeOpacity={0.8}
            >
              <Icon
                name="shield-checkmark"
                size={Layout.iconSize.l * 1.1}
                color={theme.white}
              />
              <Text style={styles.riskAssessmentButtonText}>
                Avalie se está em risco
              </Text>
            </TouchableOpacity>
          </View>

          {/* --- SEÇÃO PLANO DE SEGURANÇA --- */}
          <View style={[styles.safetyPlanSection, { marginTop: 20 }]}>
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

      {/* Modal do Formulário de Avaliação de Risco */}
      <ModalComponent
        isVisible={isFormModalVisible}
        onClose={() => setIsFormModalVisible(false)}
      >
        <FormularioAvaliacaoRisco onFormSubmit={handleFormSubmit} />
      </ModalComponent>

      {/* Modal de Exibição dos Resultados do Formulário (separada da modal de input) */}
      <ModalComponent
        isVisible={isResultModalVisible}
        onClose={handleCloseResultModal}
      >
        {formResult && (
          <ScrollView contentContainerStyle={styles.resultModalScrollContent}>
            <View style={styles.formResultContainer}>
              <Text style={styles.formResultTitle}>
                Resultado da Avaliação de Risco:
              </Text>
              <Text style={styles.formResultText}>
                <Text style={styles.boldText}>Sua Pontuação:</Text>{" "}
                {formResult.pontuacao} / 24
              </Text>
              <Text style={styles.formResultText}>
                <Text style={styles.boldText}>Nível de Risco Indicado:</Text>{" "}
                <Text
                  style={{
                    fontWeight: "bold",
                    color: getRiskColor(formResult.nivel)
                  }}
                >
                  {formResult.nivel}
                </Text>
              </Text>
              <View style={styles.orientacaoSection}>
                {getOrientacoes(formResult.nivel)}
              </View>
              <Text style={styles.disclaimerText}>
                <Text style={styles.boldText}>**Atenção**</Text>:
                Independentemente do preenchimento deste formulário ou de suas
                respostas, as medidas protetivas de urgência requeridas pela
                vítima devem ser apreciadas e a persecução criminal deve ter
                continuidade. Poucas respostas positivas não significam
                desnecessidade de intervenções de proteção pelo Sistema de
                Justiça.
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleCloseResultModal}
              style={styles.closeResultButton}
            >
              <Text style={styles.closeResultButtonText}>Entendi e Fechar</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </ModalComponent>
    </SafeAreaView>
  );
}

// --- ESTILOS ATUALIZADOS ---
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: Layout.spacing.xl
  },
  mainContent: {
    paddingHorizontal: Layout.spacing.m
  },
  header: {
    alignItems: "center",
    backgroundColor: theme.white,
    borderRadius: Layout.borderRadius.m,
    padding: Layout.spacing.m,
    marginBottom: Layout.spacing.m,
    shadowColor: Colors.light.black,
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
  helpButton: {
    backgroundColor: Colors.light.danger,
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
    marginBottom: Layout.spacing.xs
  },
  quickAccessSection: {
    marginBottom: Layout.spacing.xs
  },
  riskAssessmentSection: {
    backgroundColor: theme.white,
    borderRadius: Layout.borderRadius.m,
    padding: Layout.spacing.m,
    marginBottom: Layout.spacing.xs,
    shadowColor: Colors.light.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    alignItems: "center"
  },
  riskAssessmentSubTitle: {
    ...Typography.body2,
    color: theme.mediumGrey,
    textAlign: "center",
    marginBottom: Layout.spacing.l,
    paddingHorizontal: Layout.spacing.s
  },
  riskAssessmentButton: {
    backgroundColor: Colors.light.primary,
    width: "90%",
    paddingVertical: Layout.spacing.l,
    borderRadius: Layout.borderRadius.m,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    marginBottom: Layout.spacing.s
  },
  riskAssessmentButtonText: {
    ...Typography.h3,
    fontFamily: Typography.fontFamilyBold,
    color: theme.white,
    marginLeft: Layout.spacing.s,
    textAlign: "center",
    lineHeight: Typography.h3.fontSize * 1.2
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
    width: windowWidth * 0.45,
    marginRight: Layout.spacing.m,
    shadowColor: Colors.light.black,
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
  },
  formResultContainer: {
    backgroundColor: Colors.light.cardBackground,
    padding: 25,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.light.tint
  },
  formResultTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: Colors.light.primary,
    textAlign: "center"
  },
  formResultText: {
    fontSize: 16,
    marginBottom: 8,
    color: Colors.light.text
  },
  boldText: {
    fontWeight: "bold"
  },
  orientacaoSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.light.borderColor,
    borderStyle: "dashed",
    paddingTop: 20
  },
  orientacaoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: Colors.light.primary
  },
  orientacaoText: {
    fontSize: 15,
    marginBottom: 10,
    lineHeight: 22,
    color: Colors.light.text
  },
  orientacaoListItem: {
    fontSize: 14,
    marginLeft: 10,
    marginBottom: 5,
    color: Colors.light.text
  },
  disclaimerText: {
    fontSize: 12,
    color: Colors.light.mediumGrey,
    marginTop: 20,
    fontStyle: "italic"
  },
  // Estilos para a modal de resultados
  resultModalScrollContent: {
    flexGrow: 1, // Permite que a scrollview se expanda para caber o conteúdo
    justifyContent: "flex-start", // Alinha o conteúdo ao topo
    paddingBottom: 20 // Espaçamento extra no final para o botão
  },
  closeResultButton: {
    backgroundColor: Colors.light.tint, // Cor do botão de fechar
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20
  },
  closeResultButtonText: {
    color: Colors.light.white,
    fontSize: 18,
    fontWeight: "bold"
  }
});
