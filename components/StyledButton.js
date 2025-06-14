// components/StyledButton.js
import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View
} from "react-native";
import Colors from "../constants/Colors";
import Typography from "../constants/Typography";
import Layout from "../constants/Layout";
import Icon from "./Icon"; // Nosso componente Icon

const theme = Colors.light;

const StyledButton = ({
  title,
  onPress,
  variant = "primary", // 'primary', 'secondary', 'danger', 'success', 'outline', 'transparent'
  size = "medium", // 'small', 'medium', 'large'
  disabled = false,
  loading = false,
  iconLeft, // nome do ícone para Ionicons
  iconRight, // nome do ícone para Ionicons
  style,
  textStyle,
  fullWidth = false
}) => {
  const getButtonStyles = () => {
    const base = { ...styles.base, ...(fullWidth && styles.fullWidth) };
    const textBase = { ...styles.textBase };

    switch (size) {
      case "small":
        base.paddingVertical = Layout.spacing.xs;
        base.paddingHorizontal = Layout.spacing.s;
        textBase.fontSize = Typography.body2.fontSize;
        break;
      case "large":
        base.paddingVertical = Layout.spacing.m;
        base.paddingHorizontal = Layout.spacing.l;
        textBase.fontSize = Typography.h4.fontSize;
        textBase.fontFamily = Typography.h4.fontFamily;
        break;
      default: // medium
        base.paddingVertical = Layout.spacing.s + 2;
        base.paddingHorizontal = Layout.spacing.m;
        textBase.fontSize = Typography.button.fontSize;
        break;
    }

    switch (variant) {
      case "secondary":
        base.backgroundColor = theme.mediumGrey;
        textBase.color = theme.white;
        break;
      case "danger":
        base.backgroundColor = theme.danger;
        textBase.color = theme.white;
        break;
      case "success":
        base.backgroundColor = theme.success;
        textBase.color = theme.white;
        break;
      case "outline":
        base.backgroundColor = "transparent";
        base.borderWidth = 1;
        base.borderColor = theme.tint;
        textBase.color = theme.tint;
        break;
      case "transparent":
        base.backgroundColor = "transparent";
        textBase.color = theme.tint;
        break;
      default: // primary
        base.backgroundColor = theme.tint;
        textBase.color = theme.white;
        break;
    }
    if (disabled || loading) {
      base.backgroundColor = theme.lightGrey;
      textBase.color = theme.mediumGrey;
      if (variant === "outline" || variant === "transparent") {
        base.backgroundColor = "transparent";
        base.borderColor = theme.lightGrey;
        textBase.color = theme.mediumGrey;
      }
    }
    return { button: base, text: textBase };
  };

  const { button, text } = getButtonStyles();

  return (
    <TouchableOpacity
      style={[button, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={text.color || theme.tint} size="small" />
      ) : (
        <View style={styles.contentWrapper}>
          {iconLeft && (
            <Icon
              name={iconLeft}
              size={text.fontSize || Layout.iconSize.m}
              color={text.color}
              style={styles.iconSpacing}
            />
          )}
          <Text style={[text, textStyle]}>{title}</Text>
          {iconRight && (
            <Icon
              name={iconRight}
              size={text.fontSize || Layout.iconSize.m}
              color={text.color}
              style={styles.iconSpacingLeft}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Layout.borderRadius.xl, // Mais arredondado
    // paddingVertical: Layout.spacing.s + 2, // 10px (ajustado em getButtonStyles)
    // paddingHorizontal: Layout.spacing.m, // 16px (ajustado em getButtonStyles)
    marginVertical: Layout.spacing.s
  },
  fullWidth: {
    width: "100%"
  },
  textBase: {
    // fontSize: Typography.button.fontSize, (ajustado em getButtonStyles)
    fontFamily: Typography.button.fontFamily,
    textAlign: "center",
    fontWeight: "bold" // Para garantir destaque
  },
  contentWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  iconSpacing: {
    marginRight: Layout.spacing.s
  },
  iconSpacingLeft: {
    marginLeft: Layout.spacing.s
  }
});

export default StyledButton;
