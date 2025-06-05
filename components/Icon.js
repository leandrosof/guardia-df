// components/Icon.js
import React from "react";
import { Ionicons } from "@expo/vector-icons"; // Ou FontAwesome, MaterialIcons etc.
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";

const theme = Colors.light;

const Icon = ({
  name,
  size = Layout.iconSize.m,
  color = theme.text,
  style
}) => {
  return <Ionicons name={name} size={size} color={color} style={style} />;
};

export default Icon;
