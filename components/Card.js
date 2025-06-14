// components/Card.js
import React from "react";
import { View, StyleSheet } from "react-native";
import GlobalStyles from "../constants/GlobalStyles"; // Importa o estilo global de card

const Card = ({ children, style }) => {
  return <View style={[GlobalStyles.card, style]}>{children}</View>;
};

export default Card;
