import { View, Text, StyleSheet } from "react-native";
import { Marker, Callout } from "react-native-maps";
import Icon from "./Icon";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import Typography from "../constants/Typography";

const theme = Colors.light;

export default function MapMarker({ pointData }) {
  const { id, type, coordinate, title, description } = pointData;
  const isSafe = type === "safe";

  return (
    <Marker key={id} coordinate={coordinate}>
      <Icon
        name={isSafe ? "shield-checkmark-sharp" : "warning-sharp"}
        size={Layout.iconSize.l + 5}
        color={isSafe ? theme.success : theme.danger}
      />
      <Callout tooltip={false}>
        <View style={styles.calloutView}>
          <Text style={styles.calloutTitle}>{title}</Text>
          <Text style={styles.calloutDescription}>{description}</Text>
        </View>
      </Callout>
    </Marker>
  );
}

const styles = StyleSheet.create({
  calloutView: {
    width: 210,
    padding: Layout.spacing.s,
    backgroundColor: theme.cardBackground,
    borderRadius: Layout.borderRadius.m
  },
  calloutTitle: {
    ...Typography.body2,
    fontFamily: Typography.fontFamilyBold,
    color: theme.text,
    marginBottom: Layout.spacing.xs
  },
  calloutDescription: {
    ...Typography.caption,
    color: theme.mediumGrey
  }
});
