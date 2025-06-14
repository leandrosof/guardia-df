import React, { useRef, useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Modal,
  TextInput,
  Switch
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, {
  Marker,
  Callout,
  Circle,
  Polyline,
  Heatmap
} from "react-native-maps";
import { useEmergency } from "../../contexts/EmergencyContext";
import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import Typography from "../../constants/Typography";
import GlobalStyles from "../../constants/GlobalStyles";
import Icon from "../../components/Icon";
import MapMarker from "../../components/MapMarker";
import StyledButton from "../../components/StyledButton";
import { HEATMAP_POINTS } from "../../utils/heatmap_points";

const theme = Colors.light;
const DANGER_RADIUS_METERS = 500;

const safeTitles = [
  "Base da Polícia Militar",
  "Posto da Guarda Municipal",
  "Hospital Público",
  "Estação de Metrô Monitorada",
  "Shopping Center com Segurança",
  "Posto de Bombeiros",
  "Universidade Federal",
  "Delegacia de Polícia",
  "Unidade de Saúde 24h",
  "Câmara de Monitoramento Urbano"
];

const safeDescriptions = [
  "Área vigiada constantemente por forças de segurança.",
  "Local com presença frequente de viaturas policiais.",
  "Zona com baixo índice de criminalidade.",
  "Região com segurança patrimonial ativa.",
  "Área pública com videomonitoramento e apoio à população."
];

const riskTitles = [
  "Área com Alto Índice de Roubos",
  "Região com Relatos de Assédio",
  "Beco Pouco Iluminado",
  "Travessa com Histórico de Crimes",
  "Zona Crítica de Furtos",
  "Ponto de Tráfico Recorrente",
  "Local de Aglomeração Suspeita",
  "Praça com Ocorrências Recentes",
  "Caminho Isolado",
  "Região de Baixa Iluminação"
];

const riskDescriptions = [
  "Relatos recentes de furtos e assaltos.",
  "Zona identificada com baixa segurança à noite.",
  "Local perigoso para circulação individual.",
  "Área com histórico de ocorrências policiais.",
  "Região considerada insegura por moradores.",
  "Ponto de alerta para pessoas desacompanhadas."
];

export default function MapScreen() {
  const {
    currentLocation,
    simulatedAggressor,
    policeUnits,
    proximityAlert,
    escapeRoute,
    dispatchRoute,
    interceptRoute,
    isSimulationRunning,
    pauseSimulation,
    resumeSimulation,
    resetSimulation
  } = useEmergency();

  const [isHeatmapSafe, setIsHeatmapSafe] = useState([]);
  const [isHeatmapRisk, setIsHeatmapRisk] = useState([]);

  const SAFETY_THRESHOLD = 14;

  const safePoints = useMemo(() => {
    return (HEATMAP_POINTS || []).filter((p) => p.weight <= SAFETY_THRESHOLD);
  }, [HEATMAP_POINTS]);

  const riskPoints = useMemo(() => {
    return (HEATMAP_POINTS || []).filter((p) => p.weight > SAFETY_THRESHOLD);
  }, [HEATMAP_POINTS]);

  const INITIAL_MOCK_POINTS = useMemo(() => {
    if (!safePoints || !riskPoints) return [];

    const safe = safePoints.map((p, index) => ({
      id: `safe_point_${index + 1}`,
      type: "safe",
      weight: p.weight,
      coordinate: {
        latitude: p.latitude,
        longitude: p.longitude
      },
      radius: Math.floor(Math.random() * 500) + 100, // 100 a 600
      latitude: p.latitude,
      longitude: p.longitude,
      title: safeTitles[index % safeTitles.length],
      description: safeDescriptions[index % safeDescriptions.length]
    }));

    const risk = riskPoints.map((p, index) => ({
      id: `risk_point_${index + 1}`,
      type: "risk",
      weight: p.weight,
      radius: Math.floor(Math.random() * 100) + 20, // 20 a 120
      coordinate: {
        latitude: p.latitude,
        longitude: p.longitude
      },
      latitude: p.latitude,
      longitude: p.longitude,
      title: riskTitles[index % riskTitles.length],
      description: riskDescriptions[index % riskDescriptions.length]
    }));

    setIsHeatmapSafe(safe);
    setIsHeatmapRisk(risk);

    return [...safe, ...risk];
  }, [safePoints, riskPoints]);

  const mapRef = useRef(null);
  const [points, setPoints] = useState(INITIAL_MOCK_POINTS);
  const [isAddingPoint, setIsAddingPoint] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [newPointData, setNewPointData] = useState({
    coordinate: null,
    type: "risk",
    title: "",
    description: ""
  });
  const [mapType, setMapType] = useState("standard");
  const [isHeatmapVisible, setIsHeatmapVisible] = useState(false);
  const [viewMode, setViewMode] = useState("user");
  console.log(newPointData);
  const toggleViewMode = () =>
    setViewMode((prev) => (prev === "user" ? "police" : "user"));
  const toggleMapType = () =>
    setMapType((prev) => (prev === "standard" ? "satellite" : "standard"));
  const toggleHeatmapVisibility = () => setIsHeatmapVisible((prev) => !prev);
  const handleMapPress = (event) => {
    if (isAddingPoint) {
      const { coordinate } = event.nativeEvent;
      setNewPointData({ ...newPointData, coordinate });
      setModalVisible(true);
      setIsAddingPoint(false);
    }
  };
  const handleSaveNewPoint = () => {
    if (!newPointData.title) return;
    const newPoint = { ...newPointData, id: `user_point_${Date.now()}` };
    setPoints((p) => [...p, newPoint]);
    setModalVisible(false);
    setNewPointData({
      coordinate: null,
      type: "risk",
      title: "",
      description: ""
    });
  };

  useEffect(() => {
    if (!mapRef.current || !currentLocation || !simulatedAggressor?.location)
      return;

    let coordsToFit = [currentLocation, simulatedAggressor.location];
    if (viewMode === "police" && policeUnits) {
      coordsToFit.push(...policeUnits.map((u) => u.coordinate));
    }

    if (!isSimulationRunning || viewMode === "police") {
      mapRef.current.fitToCoordinates(coordsToFit, {
        edgePadding: { top: 150, right: 80, bottom: 200, left: 80 },
        animated: true
      });
    } else if (viewMode === "user" && proximityAlert.isActive) {
      mapRef.current.animateToRegion(
        { ...currentLocation, latitudeDelta: 0.01, longitudeDelta: 0.01 },
        500
      );
    }
  }, [
    currentLocation,
    simulatedAggressor?.location,
    policeUnits,
    isSimulationRunning,
    proximityAlert.isActive,
    viewMode
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
        mapType={mapType}
        onPress={handleMapPress}
        showsUserLocation={false}
        showsMyLocationButton={false}
        mapPadding={{ bottom: 90 }}
      >
        {isHeatmapVisible && (
          <>
            {/* CAMADA 1: A GRANDE ÁREA SEGURA (VERDE) */}
            {isHeatmapSafe?.map((point, index) => (
              <Circle
                key={`safe-${index}`}
                center={{
                  latitude: point.latitude,
                  longitude: point.longitude
                }}
                radius={point.radius}
                strokeWidth={0}
                fillColor="rgba(121, 242, 121, 0.3)"
                strokeColor="transparent"
              />
            ))}

            {/* CAMADA 2: OS HOTSPOTS DE RISCO (VERMELHO) */}
            {isHeatmapRisk?.map((point, index) => (
              <Circle
                key={`risk-${index}`}
                center={{
                  latitude: point.latitude,
                  longitude: point.longitude
                }}
                radius={point.radius}
                strokeWidth={0}
                fillColor="rgba(255, 0, 0, 0.5)"
                strokeColor="transparent"
              />
            ))}
          </>
        )}

        {viewMode === "user" && currentLocation && isSimulationRunning && (
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

        {viewMode === "user" && escapeRoute && escapeRoute.length > 1 && (
          <Polyline
            coordinates={escapeRoute}
            strokeColor={theme.tint}
            strokeWidth={8}
            zIndex={150}
            lineDashPattern={[10, 5]}
          />
        )}

        {viewMode === "user" && escapeRoute && escapeRoute.length > 1 && (
          <Marker coordinate={escapeRoute[escapeRoute.length - 1]} zIndex={190}>
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

        {viewMode === "police" && dispatchRoute && dispatchRoute.length > 1 && (
          <Polyline
            coordinates={dispatchRoute}
            strokeColor={Colors.light.securityBlue || "blue"}
            strokeWidth={6}
            zIndex={140}
          />
        )}

        {viewMode === "police" &&
          interceptRoute &&
          interceptRoute.length > 1 && (
            <Polyline
              coordinates={interceptRoute}
              strokeColor={theme.danger}
              strokeWidth={6}
              lineDashPattern={[25, 10]}
              zIndex={145}
            />
          )}

        {viewMode === "police" &&
          policeUnits?.map((unit) => (
            <Marker key={unit.id} coordinate={unit.coordinate} zIndex={90}>
              <Icon
                name="car-sport-sharp"
                size={Layout.iconSize.l + 8}
                color={Colors.light.securityBlue || "blue"}
              />
              <Callout>
                <Text>Viatura</Text>
              </Callout>
            </Marker>
          ))}

        {viewMode === "user" &&
          points.map((point) => <MapMarker key={point.id} pointData={point} />)}

        {isSimulationRunning && simulatedAggressor?.location && (
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

        {currentLocation && (
          <Marker coordinate={currentLocation} zIndex={200}>
            <Icon
              name={
                viewMode === "police" && proximityAlert.isActive
                  ? "alert-circle"
                  : "woman-sharp"
              }
              size={Layout.iconSize.l + 5}
              color={theme.white}
              style={[
                styles.userIcon,
                viewMode === "police" &&
                  proximityAlert.isActive &&
                  styles.userAsAlertIcon
              ]}
            />
            <Callout>
              <Text style={styles.calloutTitle}>
                {viewMode === "police" ? "Vítima" : "Você"}
              </Text>
            </Callout>
          </Marker>
        )}
      </MapView>

      <View style={styles.mapControlsContainer}>
        <View style={styles.mapActionControls}>
          <TouchableOpacity
            onPress={toggleMapType}
            style={styles.controlButton}
          >
            <Icon
              name="globe-outline"
              size={Layout.iconSize.l}
              color={theme.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsAddingPoint(true)}
            style={[
              styles.controlButton,
              isAddingPoint && styles.controlButtonActive
            ]}
          >
            <Icon
              name="add-circle-outline"
              size={Layout.iconSize.l}
              color={isAddingPoint ? theme.white : theme.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={toggleHeatmapVisibility}
            style={[
              styles.controlButton,
              isHeatmapVisible && styles.controlButtonActive
            ]}
          >
            <Icon
              name="flame-outline"
              size={Layout.iconSize.l}
              color={isHeatmapVisible ? theme.white : theme.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={toggleViewMode}
            style={styles.controlButton}
          >
            <Icon
              name={viewMode === "user" ? "shield-outline" : "person-outline"}
              size={Layout.iconSize.l}
              color={theme.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={isSimulationRunning ? pauseSimulation : resumeSimulation}
            style={styles.controlButton}
          >
            <Icon
              name={isSimulationRunning ? "pause-circle" : "play-circle"}
              size={Layout.iconSize.l}
              color={theme.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={resetSimulation}
            style={styles.controlButton}
          >
            <Icon
              name="refresh-circle"
              size={Layout.iconSize.l}
              color={theme.mediumGrey}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.legendContainer}>
        <Text style={styles.viewModeTitle}>
          {viewMode === "user" ? "VISÃO DA USUÁRIA" : "VISÃO DA POLÍCIA"}
        </Text>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Adicionar Novo Ponto</Text>
            <TextInput
              style={GlobalStyles.input}
              placeholder="Título do Ponto"
              value={newPointData.title}
              onChangeText={(text) =>
                setNewPointData((prev) => ({ ...prev, title: text }))
              }
            />
            <TextInput
              style={[GlobalStyles.input, { height: 80 }]}
              placeholder="Descrição (opcional)"
              multiline
              value={newPointData.description}
              onChangeText={(text) =>
                setNewPointData((prev) => ({ ...prev, description: text }))
              }
            />
            <View style={styles.switchContainer}>
              <Text
                style={[
                  styles.switchLabel,
                  {
                    color:
                      newPointData.type === "risk"
                        ? theme.danger
                        : theme.mediumGrey
                  }
                ]}
              >
                Risco
              </Text>
              <Switch
                trackColor={{ false: theme.danger, true: theme.success }}
                thumbColor={theme.white}
                onValueChange={() =>
                  setNewPointData((prev) => ({
                    ...prev,
                    type: prev.type === "risk" ? "safe" : "risk"
                  }))
                }
                value={newPointData.type === "safe"}
              />
              <Text
                style={[
                  styles.switchLabel,
                  {
                    color:
                      newPointData.type === "safe"
                        ? theme.success
                        : theme.mediumGrey
                  }
                ]}
              >
                Seguro
              </Text>
            </View>
            <StyledButton
              title="Salvar Ponto"
              onPress={handleSaveNewPoint}
              fullWidth
            />
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  map: { flex: 1 },
  userIcon: {
    backgroundColor: theme.tint,
    borderRadius: 22,
    borderColor: theme.white
  },
  userAsAlertIcon: { backgroundColor: theme.danger },
  normalAggressorIcon: {},
  alertAggressorIcon: {
    backgroundColor: theme.danger,
    borderRadius: 22,
    padding: 4
  },
  calloutView: { padding: 8 },
  calloutTitle: { fontFamily: Typography.fontFamilyBold, fontSize: 14 },
  calloutDescription: { ...Typography.caption, color: theme.mediumGrey },
  legendContainer: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    elevation: 5
  },
  viewModeTitle: {
    ...Typography.body1,
    fontFamily: Typography.fontFamilyBold,
    color: theme.text
  },
  mapControlsContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 20,
    right: 16,
    alignItems: "flex-end"
  },
  simulationControls: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 25,
    padding: 2,
    flexDirection: "row",
    alignItems: "center",
    elevation: 5,
    width: 130
  },
  mapActionControls: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 25,
    padding: 4,
    flexDirection: "row",
    alignItems: "center",
    elevation: 5,
    marginTop: Platform.OS === "ios" ? Layout.spacing.s : Layout.spacing.xxl
  },
  controlButton: { padding: 8 },
  controlButtonActive: { backgroundColor: theme.tint, borderRadius: 50 },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  modalView: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    elevation: 5,
    marginBottom: 210
  },
  modalTitle: { ...Typography.h4, marginBottom: 15 },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20
  },
  switchLabel: {
    ...Typography.body1,
    fontFamily: Typography.fontFamilyBold,
    marginHorizontal: 10
  },
  cancelText: { color: theme.mediumGrey, marginTop: 15, padding: 5 }
});
