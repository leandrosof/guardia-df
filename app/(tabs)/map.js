// app/(tabs)/map.js
import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, Callout, Circle, Polyline } from "react-native-maps";
import { useEmergency } from "../../contexts/EmergencyContext";
import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import Typography from "../../constants/Typography";
import GlobalStyles from "../../constants/GlobalStyles";
import Icon from "../../components/Icon";

const theme = Colors.light;
const DANGER_RADIUS_METERS = 500;

export default function MapScreen() {
  const { currentLocation, simulatedAggressor, proximityAlert, escapeRoute } =
    useEmergency();
  const mapRef = useRef(null);

  // Animar o mapa para seguir a mulher quando ela se move
  useEffect(() => {
    if (currentLocation && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          ...currentLocation,
          latitudeDelta: 0.02,
          longitudeDelta: 0.015
        },
        500
      ); // Animação mais suave
    }
  }, [currentLocation]);

  return (
    <SafeAreaView
      style={[GlobalStyles.safeAreaContainer, styles.screen]}
      edges={["left", "right", "top"]}
    >
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          ...currentLocation,
          latitudeDelta: 0.02,
          longitudeDelta: 0.015
        }}
        showsUserLocation={false}
        showsMyLocationButton={false}
      >
        {/* Círculo de Proximidade */}
        {currentLocation && (
          <Circle
            center={currentLocation}
            radius={DANGER_RADIUS_METERS}
            fillColor={
              proximityAlert.isActive
                ? "rgba(220, 20, 60, 0.25)"
                : "rgba(46, 139, 87, 0.20)"
            }
            strokeColor={proximityAlert.isActive ? theme.danger : theme.success}
            strokeWidth={2}
            zIndex={50}
          />
        )}

        {/* Rota de Fuga - AGORA SÓLIDA E COM Z-INDEX ALTO */}
        {escapeRoute && (
          <Polyline
            coordinates={escapeRoute}
            strokeColor={theme.tint} // Roxo para destaque
            strokeWidth={7} // Mais grossa para ser bem visível
            zIndex={150} // zIndex para garantir que fique por cima do círculo
          />
        )}

        {/* Marcador da Mulher Simulada (agora se move) */}
        {currentLocation && (
          <Marker coordinate={currentLocation} zIndex={200}>
            <Icon
              name="woman-sharp"
              size={Layout.iconSize.l + 5}
              color={theme.white}
              style={styles.userIcon}
            />
            <Callout>
              <Text style={styles.calloutTitle}>Você (Simulado)</Text>
            </Callout>
          </Marker>
        )}

        {/* Marcador do Agressor (agora se move) */}
        {simulatedAggressor && simulatedAggressor.location && (
          <Marker
            key={simulatedAggressor.id}
            coordinate={simulatedAggressor.location}
            zIndex={100}
          >
            <Icon
              name={"skull-sharp"}
              size={Layout.iconSize.l + 6}
              color={proximityAlert.isActive ? theme.white : theme.black}
              style={
                proximityAlert.isActive
                  ? styles.alertAggressorIcon
                  : styles.normalAggressorIcon
              }
            />
            <Callout>
              <Text style={styles.calloutTitle}>
                Agressor: {simulatedAggressor.name}
              </Text>
            </Callout>
          </Marker>
        )}

        {/* Ponto Seguro de Destino da Rota */}
        {escapeRoute && (
          <Marker coordinate={escapeRoute[1]} zIndex={190}>
            <Icon
              name="shield-checkmark-sharp"
              size={Layout.iconSize.l + 10}
              color={theme.success}
            />
            <Callout>
              <Text style={styles.calloutTitle}>Ponto Seguro</Text>
            </Callout>
          </Marker>
        )}
      </MapView>

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <Icon
            name="woman-sharp"
            size={Layout.iconSize.m}
            color={theme.tint}
          />
          <Text style={styles.legendText}>Você</Text>
        </View>
        <View style={styles.legendItem}>
          <Icon
            name="shield-checkmark-sharp"
            size={Layout.iconSize.m}
            color={theme.success}
          />
          <Text style={styles.legendText}>Seguro</Text>
        </View>
        <View style={styles.legendItem}>
          <Icon
            name="skull-sharp"
            size={Layout.iconSize.m}
            color={theme.black}
          />
          <Text style={styles.legendText}>Agressor</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  map: { flex: 1 },
  userIcon: {
    backgroundColor: theme.tint,
    borderRadius: 22,
    padding: 5,
    borderWidth: 2,
    borderColor: theme.white
  },
  normalAggressorIcon: {},
  alertAggressorIcon: {
    backgroundColor: theme.danger,
    borderRadius: 22,
    padding: 4
  },
  calloutView: { padding: 8 },
  calloutTitle: { fontFamily: Typography.fontFamilyBold, fontSize: 14 },
  legendContainer: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 8,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  legendItem: { flexDirection: "row", alignItems: "center" },
  legendText: { ...Typography.caption, marginLeft: 4 }
});
