import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, Callout, Circle, Polyline } from "react-native-maps";

// Ajuste os caminhos conforme a sua estrutura de pastas
import { useEmergency } from "../../contexts/EmergencyContext";
import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import Typography from "../../constants/Typography";
import GlobalStyles from "../../constants/GlobalStyles";
import Icon from "../../components/Icon";
import MapMarker from "../../components/MapMarker";

const theme = Colors.light;
const DANGER_RADIUS_METERS = 500;

// Lista de pontos de interesse FIXOS e PRÓXIMOS da simulação para a demo
const mockPoints = [
  {
    id: "safe_point_1",
    type: "safe",
    coordinate: { latitude: -15.7815, longitude: -47.9305 }, // Sudoeste
    title: "Comércio Seguro (Simulado)",
    description: "Ponto de apoio com movimento."
  },
  {
    id: "safe_point_2",
    type: "safe",
    coordinate: { latitude: -15.779, longitude: -47.9275 }, // Nordeste
    title: "Posto Policial (Simulado)",
    description: "Ponto de apoio policial."
  },
  {
    id: "risk_point_1",
    type: "risk",
    coordinate: { latitude: -15.7788, longitude: -47.931 }, // Noroeste
    title: "Praça Mal Iluminada (Sim.)",
    description: "Área com relatos de incidentes."
  }
];

export default function MapScreen() {
  const {
    currentLocation,
    simulatedAggressor,
    proximityAlert,
    escapeRoute,
    isSimulationRunning,
    pauseSimulation,
    resumeSimulation,
    resetSimulation
  } = useEmergency();

  const mapRef = useRef(null);

  // NOVO: Estado para controlar o tipo do mapa
  const [mapType, setMapType] = useState("standard"); // 'standard' ou 'satellite'

  // NOVO: Função para alternar o tipo do mapa
  const toggleMapType = () => {
    setMapType((prevType) =>
      prevType === "standard" ? "satellite" : "standard"
    );
  };

  // useEffect para controlar a câmera do mapa
  useEffect(() => {
    if (!mapRef.current || !currentLocation || !simulatedAggressor?.location) {
      return;
    }

    // Se a simulação está pausada ou no início (sem alerta), enquadra a cena
    if (!isSimulationRunning || !proximityAlert.isActive) {
      mapRef.current.fitToCoordinates(
        [currentLocation, simulatedAggressor.location],
        {
          edgePadding: {
            top: 150,
            right: 80,
            bottom: 200,
            left: 80 // Mais padding embaixo para legenda/controles
          },
          animated: true
        }
      );
    } else if (proximityAlert.isActive) {
      // Se a simulação está rodando E um alerta está ativo (fuga), segue a mulher
      mapRef.current.animateToRegion(
        {
          ...currentLocation,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01
        },
        500
      ); // Animação suave para seguir
    }
  }, [
    currentLocation,
    simulatedAggressor.location,
    isSimulationRunning,
    proximityAlert.isActive
  ]);

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
        mapPadding={{ bottom: 90 }} // Garante que a legenda não cubra logos do Google Maps
        mapType={mapType}
      >
        {/* Círculo de Proximidade (Verde/Vermelho) */}
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

        {/* Rota de Fuga Inteligente */}
        {escapeRoute && (
          <Polyline
            coordinates={escapeRoute}
            strokeColor={theme.tint}
            strokeWidth={7}
            zIndex={150}
          />
        )}

        {/* Pontos de Interesse Fixos */}
        {mockPoints.map((point) => (
          <MapMarker key={point.id} pointData={point} />
        ))}

        {/* Marcador do Agressor */}
        {simulatedAggressor?.location && (
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
              <Text style={styles.calloutTitle}>Agressor</Text>
            </Callout>
          </Marker>
        )}

        {/* Marcador da Mulher Simulada */}
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

      {/* Controles da Simulação */}
      <View style={styles.simulationControls}>
        <TouchableOpacity
          onPress={isSimulationRunning ? pauseSimulation : resumeSimulation}
          style={styles.controlButton}
        >
          <Icon
            name={isSimulationRunning ? "pause-circle" : "play-circle"}
            size={Layout.iconSize.l + 10}
            color={theme.primary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={resetSimulation}
          style={styles.controlButton}
        >
          <Icon
            name="refresh-circle"
            size={Layout.iconSize.l + 10}
            color={theme.mediumGrey}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={toggleMapType} style={styles.mapTypeButton}>
        <Icon
          name="globe-outline"
          size={Layout.iconSize.l}
          color={theme.primary}
        />
      </TouchableOpacity>

      {/* Legenda Corrigida e Completa */}
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
            name="warning-sharp"
            size={Layout.iconSize.m}
            color={theme.danger}
          />
          <Text style={styles.legendText}>Risco</Text>
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
  calloutTitle: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: 14
  },
  legendContainer: {
    position: "absolute",
    bottom: 10,
    left: 16,
    right: 16,
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 8,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center"
  },
  legendText: {
    ...Typography.caption,
    marginLeft: 4,
    fontSize: 10
  },
  simulationControls: {
    position: "absolute",
    top: 60,
    right: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 25,
    padding: 4,
    flexDirection: "row",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  },
  controlButton: {
    padding: 6
  },
  mapTypeButton: {
    position: "absolute",
    top: 60,
    left: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 25,
    padding: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  }
});
