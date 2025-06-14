import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import Icon from "./Icon";
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
    width: Layout.window.width * 0.6,
    height: Layout.window.width * 0.6,
    borderRadius: Layout.window.width * 0.3,
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowColor: theme.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    borderWidth: 4,
    borderColor: theme.white
  },
  disabled: {
    backgroundColor: theme.mediumGrey,
    borderColor: theme.lightGrey
  },
  panicButtonText: {
    ...Typography.h3,
    fontFamily: Typography.fontFamilyBold,
    color: theme.white,
    marginTop: Layout.spacing.s,
    textAlign: "center",
    fontSize: 20
  },
  panicButtonSubtitle: {
    ...Typography.caption,
    color: theme.white,
    textAlign: "center",
    marginTop: Layout.spacing.xs
  }
});

export default PanicButton;
