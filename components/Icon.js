import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";

const theme = Colors.light;

export default function Icon({
  name,
  size = Layout.iconSize.m,
  color = theme.text,
  style
}) {
  return <Ionicons name={name} size={size} color={color} style={style} />;
}
