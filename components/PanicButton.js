// components/PanicButton.js
import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import Icon from "./Icon"; // Seu componente Icon
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import Typography from "../constants/Typography";

const theme = Colors.light;

const PanicButton = ({
  onPress,
  title = "ACIONAR PÂNICO",
  subtitle,
  disabled
}) => {
  return (
    <TouchableOpacity
      style={[styles.panicButton, disabled && styles.disabled]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <Icon
        name="shield-checkmark"
        size={Layout.iconSize.l * 2.5}
        color={theme.white}
      />
      <Text style={styles.panicButtonText}>{title}</Text>
      {subtitle && <Text style={styles.panicButtonSubtitle}>{subtitle}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  panicButton: {
    backgroundColor: theme.danger,
    width: Layout.window.width * 0.6, // Ajuste o tamanho conforme necessário
    height: Layout.window.width * 0.6, // Para manter circular
    borderRadius: Layout.window.width * 0.3, // Metade da largura/altura
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowColor: theme.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    borderWidth: 4,
    borderColor: theme.white // Uma borda branca para destaque
  },
  disabled: {
    backgroundColor: theme.mediumGrey,
    borderColor: theme.lightGrey
  },
  panicButtonText: {
    ...Typography.h3, // Um pouco maior
    fontFamily: Typography.fontFamilyBold,
    color: theme.white,
    marginTop: Layout.spacing.s,
    textAlign: "center",
    fontSize: 20 // Ajuste
  },
  panicButtonSubtitle: {
    ...Typography.caption,
    color: theme.white,
    textAlign: "center",
    marginTop: Layout.spacing.xs
  }
});

export default PanicButton;
