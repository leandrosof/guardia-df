// constants/GlobalStyles.js
import { StyleSheet } from "react-native";
import Colors from "./Colors"; // Usaremos o tema 'light' por padrão
import Typography from "./Typography";
import Layout from "./Layout";

const theme = Colors.light; // ou Colors[Appearance.getColorScheme() || 'light'];

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    paddingHorizontal: Layout.spacing.m,
    paddingVertical: Layout.spacing.l
  },
  safeAreaContainer: {
    // Para usar com SafeAreaView
    flex: 1,
    backgroundColor: theme.background
  },
  contentContainer: {
    // Para usar dentro de SafeAreaView ou ScrollView
    paddingHorizontal: Layout.spacing.m,
    paddingVertical: Layout.spacing.l
  },
  titleText: {
    ...Typography.h3,
    color: theme.primary,
    marginBottom: Layout.spacing.m,
    textAlign: "center"
  },
  subTitleText: {
    ...Typography.h4,
    color: theme.text,
    marginBottom: Layout.spacing.s,
    textAlign: "center"
  },
  bodyText: {
    ...Typography.body1,
    color: theme.text,
    marginBottom: Layout.spacing.s
  },
  captionText: {
    ...Typography.caption,
    color: theme.mediumGrey,
    textAlign: "center"
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  // Mais estilos globais conforme necessário
  // Ex: sombras, estilos de card específicos
  card: {
    backgroundColor: theme.cardBackground,
    borderRadius: Layout.borderRadius.m,
    padding: Layout.spacing.m,
    marginBottom: Layout.spacing.m,
    shadowColor: theme.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: Layout.borderRadius.s,
    elevation: 3 // Para Android
  },
  input: {
    ...Typography.body1,
    backgroundColor: theme.inputBackground,
    borderColor: theme.borderColor,
    borderWidth: 1,
    borderRadius: Layout.borderRadius.m,
    paddingHorizontal: Layout.spacing.m,
    paddingVertical: Layout.spacing.s + Layout.spacing.xs, // 12
    marginBottom: Layout.spacing.m,
    color: theme.text
  }
  // Adicione mais estilos conforme necessário
});
