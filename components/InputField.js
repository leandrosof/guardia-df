// components/InputField.js
import React from "react";
import { TextInput, View, Text, StyleSheet } from "react-native";
import GlobalStyles from "../constants/GlobalStyles";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import Typography from "../constants/Typography";

const theme = Colors.light;

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  error,
  multiline,
  numberOfLines,
  style,
  inputStyle,
  ...props
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          GlobalStyles.input,
          styles.input,
          error ? styles.inputError : {},
          inputStyle
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || label}
        placeholderTextColor={theme.placeholderText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        autoCapitalize="none"
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Layout.spacing.xs // Reduzido, pois o input já tem margem
  },
  label: {
    ...Typography.body2,
    color: theme.text,
    marginBottom: Layout.spacing.xs,
    fontWeight: "500"
  },
  input: {
    // Estilo base já vem de GlobalStyles.input
    // Adicionar estilos específicos se necessário
  },
  inputError: {
    borderColor: theme.danger
  },
  errorText: {
    ...Typography.caption,
    color: theme.danger,
    marginTop: Layout.spacing.xs
  }
});

export default InputField;
