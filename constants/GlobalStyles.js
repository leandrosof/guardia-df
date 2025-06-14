import { StyleSheet } from "react-native";
import Colors from "./Colors";
import Typography from "./Typography";
import Layout from "./Layout";

const theme = Colors.light;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    paddingHorizontal: Layout.spacing.m,
    paddingVertical: Layout.spacing.l
  },
  safeAreaContainer: {
    flex: 1,
    backgroundColor: theme.background
  },
  contentContainer: {
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
  card: {
    backgroundColor: theme.cardBackground,
    borderRadius: Layout.borderRadius.m,
    padding: Layout.spacing.m,
    marginBottom: Layout.spacing.m,
    shadowColor: theme.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: Layout.borderRadius.s,
    elevation: 3
  },
  input: {
    ...Typography.body1,
    backgroundColor: theme.inputBackground,
    borderColor: theme.borderColor,
    borderWidth: 1,
    borderRadius: Layout.borderRadius.m,
    paddingHorizontal: Layout.spacing.m,
    paddingVertical: Layout.spacing.s + Layout.spacing.xs,
    marginBottom: Layout.spacing.m,
    color: theme.text,
    width: 350
  }
});
