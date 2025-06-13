// app/(tabs)/settings.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Switch,
  ScrollView,
  Alert,
  TouchableOpacity,
  Platform
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useEmergency } from "../../contexts/EmergencyContext"; // Ajuste o caminho
import GlobalStyles from "../../constants/GlobalStyles"; // Ajuste o caminho
import Colors from "../../constants/Colors"; // Ajuste o caminho
import Typography from "../../constants/Typography"; // Ajuste o caminho
import Layout from "../../constants/Layout"; // Ajuste o caminho
import StyledButton from "../../components/StyledButton"; // Ajuste o caminho
import InputField from "../../components/InputField"; // Ajuste o caminho
import Card from "../../components/Card"; // Ajuste o caminho
import Icon from "../../components/Icon"; // Ajuste o caminho

const theme = Colors.light;

export default function SettingsScreen() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [shakeDetection, setShakeDetectionEnabled] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState([]);

  const handleAddContact = () => {
    if (name && phone) {
      setEmergencyContacts([
        ...emergencyContacts,
        { id: Date.now().toString(), name: name, phone: phone }
      ]);
      setName("");
      setPhone("");
      setIsAdding(false);
    } else {
      Alert.alert("Campos Vazios", "Preencha nome e telefone do contato.");
    }
  };

  const confirmRemoveContact = (id, contactName) => {
    Alert.alert(
      "Remover Contato",
      `Tem certeza que deseja remover "${contactName}" da sua lista de emergência?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: () => removeContact(id)
        }
      ]
    );
  };

  const removeContact = (id) => {
    setEmergencyContacts(
      emergencyContacts.filter((contact) => contact.id !== id)
    );
  };

  const renderContactItem = ({ item }) => (
    <View style={styles.contactItem}>
      <Icon
        name="person-circle-outline"
        size={Layout.iconSize.l + 10}
        color={theme.tint}
        style={styles.contactIcon}
      />
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactPhone}>{item.phone}</Text>
      </View>
      <TouchableOpacity
        onPress={() => confirmRemoveContact(item.id, item.name)}
        style={styles.removeButton}
      >
        <Icon
          name="trash-bin-outline"
          size={Layout.iconSize.m}
          color={theme.danger}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView
      style={[GlobalStyles.safeAreaContainer, styles.screen]}
      edges={["left", "right", "top"]}
    >
      <ScrollView contentContainerStyle={GlobalStyles.contentContainer}>
        <Text style={[GlobalStyles.titleText, styles.pageTitle]}>
          Ajustes e Preferências
        </Text>

        <Card>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Contatos de Emergência</Text>
            {!isAdding && (
              <StyledButton
                title="Adicionar"
                onPress={() => setIsAdding(true)}
                variant="outline"
                size="small"
                iconLeft="person-add-outline"
              />
            )}
          </View>

          {isAdding && (
            <View style={styles.addContactForm}>
              <InputField
                label="Nome do Contato"
                value={name}
                onChangeText={setName}
                placeholder="Ex: Mãe, Amigo Próximo"
              />
              <InputField
                label="Telefone"
                value={phone}
                onChangeText={setPhone}
                placeholder="+55 (DDD) XXXXX-XXXX"
                keyboardType="phone-pad"
                textContentType="telephoneNumber" // Ajuda com preenchimento automático
              />
              <View style={styles.formButtons}>
                <StyledButton
                  title="Cancelar"
                  onPress={() => setIsAdding(false)}
                  variant="transparent"
                  size="small"
                  textStyle={{ color: theme.mediumGrey }}
                />
                <StyledButton
                  title="Salvar"
                  onPress={handleAddContact}
                  variant="success"
                  size="small"
                  iconLeft="save-outline"
                />
              </View>
            </View>
          )}

          {emergencyContacts?.length === 0 && !isAdding ? (
            <Text style={styles.emptyListText}>
              Nenhum contato adicionado. Adicione para serem notificados em uma
              emergência.
            </Text>
          ) : (
            <FlatList
              data={emergencyContacts}
              keyExtractor={(item) => item.id}
              renderItem={renderContactItem}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          )}
        </Card>

        <Card style={styles.settingCard}>
          <Text style={styles.sectionTitle}>Funcionalidades de Alerta</Text>
          <View style={styles.settingRow}>
            <Icon
              name="move-outline"
              size={Layout.iconSize.m}
              color={theme.text}
              style={styles.settingIcon}
            />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingLabel}>
                Alerta por Shake (Chacoalhar)
              </Text>
              <Text style={styles.settingNote}>
                Chacoalhar o celular rapidamente acionará um alerta. Simula o
                "Botão Guardião" físico.
              </Text>
            </View>
            <Switch
              trackColor={{
                false: theme.lightGrey,
                true:
                  Platform.OS === "android"
                    ? Colors.light.tint + "50"
                    : Colors.light.tint
              }} // 50 é alpha
              thumbColor={
                shakeDetection
                  ? Platform.OS === "android"
                    ? theme.tint
                    : theme.white
                  : theme.mediumGrey
              }
              ios_backgroundColor={theme.lightGrey}
              onValueChange={() => setShakeDetectionEnabled(!shakeDetection)}
              value={shakeDetection}
              style={styles.switch}
            />
          </View>
        </Card>

        <Card style={styles.settingCard}>
          <Text style={styles.sectionTitle}>Privacidade e Dados</Text>
          <TouchableOpacity style={styles.privacyRow}>
            <Icon
              name="document-text-outline"
              size={Layout.iconSize.m}
              color={theme.text}
              style={styles.settingIcon}
            />
            <Text style={styles.privacyLabel}>Política de Privacidade</Text>
            <Icon
              name="chevron-forward-outline"
              size={Layout.iconSize.m}
              color={theme.mediumGrey}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.privacyRow}>
            <Icon
              name="information-circle-outline"
              size={Layout.iconSize.m}
              color={theme.text}
              style={styles.settingIcon}
            />
            <Text style={styles.privacyLabel}>Sobre o Guardiã DF</Text>
            <Icon
              name="chevron-forward-outline"
              size={Layout.iconSize.m}
              color={theme.mediumGrey}
            />
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

// OS ESTILOS (styles) SÃO OS MESMOS DA SettingsScreen.js ANTERIOR.
// Copie e cole o objeto 'styles' da versão anterior aqui, fazendo pequenos ajustes se necessário.
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.background
  },
  pageTitle: {
    marginBottom: Layout.spacing.l
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Layout.spacing.s // Reduzido
  },
  sectionTitle: {
    ...Typography.h4,
    color: theme.primary,
    marginBottom: Layout.spacing.m
  },
  addContactForm: {
    paddingVertical: Layout.spacing.m,
    borderTopWidth: 1,
    borderTopColor: theme.borderColor,
    marginTop: Layout.spacing.s
  },
  formButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: Layout.spacing.s
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Layout.spacing.m
  },
  separator: {
    height: 1,
    backgroundColor: theme.borderColor,
    marginLeft: Layout.iconSize.l + 10 + Layout.spacing.m // Alinhar com o início do texto do contato
  },
  contactIcon: {
    marginRight: Layout.spacing.m
  },
  contactInfo: {
    flex: 1
  },
  contactName: {
    ...Typography.body1,
    fontFamily: Typography.fontFamilyBold,
    color: theme.text
  },
  contactPhone: {
    ...Typography.body2,
    color: theme.mediumGrey
  },
  removeButton: {
    padding: Layout.spacing.s
  },
  emptyListText: {
    ...Typography.body1,
    color: theme.mediumGrey,
    textAlign: "center",
    paddingVertical: Layout.spacing.l,
    fontStyle: "italic"
  },
  settingCard: {
    marginTop: Layout.spacing.l
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "flex-start", // Para alinhar o switch com o topo do texto
    paddingVertical: Layout.spacing.s,
    justifyContent: "space-between"
  },
  settingIcon: {
    marginRight: Layout.spacing.m,
    marginTop: Layout.spacing.xs // Pequeno ajuste para alinhar visualmente
  },
  settingTextContainer: {
    flex: 1,
    marginRight: Layout.spacing.s
  },
  settingLabel: {
    ...Typography.body1,
    color: theme.text,
    fontFamily: Typography.fontFamilyMedium
  },
  settingNote: {
    ...Typography.caption,
    color: theme.mediumGrey,
    marginTop: Layout.spacing.xs,
    lineHeight: Typography.caption.lineHeight + 2
  },
  switch: {
    // O Switch pode precisar de ajustes de margin específicos por plataforma
    // Se estiver usando um wrapper, estilize o wrapper
  },
  privacyRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Layout.spacing.m,
    borderTopWidth: 1,
    borderTopColor: theme.borderColor
  },
  privacyLabel: {
    ...Typography.body1,
    color: theme.text,
    flex: 1
  }
});
