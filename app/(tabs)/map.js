import React, { useRef, useEffect, useState, useCallback } from "react";
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

const theme = Colors.light;
const DANGER_RADIUS_METERS = 500;

const INITIAL_MOCK_POINTS = [
  {
    id: "safe_point_1",
    type: "safe",
    coordinate: { latitude: -15.7815, longitude: -47.9305 },
    title: "Comércio Seguro (Simulado)",
    description: "Ponto de apoio com movimento."
  },
  {
    id: "safe_point_2",
    type: "safe",
    coordinate: { latitude: -15.779, longitude: -47.9275 },
    title: "Posto Policial (Simulado)",
    description: "Ponto de apoio policial."
  },
  {
    id: "risk_point_1",
    type: "risk",
    coordinate: { latitude: -15.7788, longitude: -47.931 },
    title: "Praça Mal Iluminada (Sim.)",
    description: "Área com relatos de incidentes."
  }
];

const HEATMAP_POINTS = [
  { latitude: -15.78, longitude: -47.929, weight: 10 },
  { latitude: -15.781, longitude: -47.928, weight: 8 },
  { latitude: -15.779, longitude: -47.927, weight: 5 },
  { latitude: -15.782, longitude: -47.93, weight: 7 },
  { latitude: -15.778, longitude: -47.931, weight: 15 },
  { latitude: -15.7785, longitude: -47.9315, weight: 12 },
  { latitude: -15.7802, longitude: -47.9287, weight: 9 },
  { latitude: -15.7811, longitude: -47.9302, weight: 6 },
  { latitude: -15.7795, longitude: -47.9309, weight: 11 },
  { latitude: -15.7807, longitude: -47.9298, weight: 8 },
  { latitude: -15.7792, longitude: -47.9283, weight: 10 },
  { latitude: -15.7808, longitude: -47.9279, weight: 7 },
  { latitude: -15.7815, longitude: -47.9284, weight: 6 },
  { latitude: -15.7779, longitude: -47.9302, weight: 13 },
  { latitude: -15.7788, longitude: -47.9289, weight: 14 },
  { latitude: -15.7819, longitude: -47.9295, weight: 5 },
  { latitude: -15.7798, longitude: -47.9311, weight: 9 },
  { latitude: -15.7783, longitude: -47.9304, weight: 12 },
  { latitude: -15.7801, longitude: -47.9281, weight: 7 },
  { latitude: -15.7813, longitude: -47.9278, weight: 6 },
  { latitude: -15.7775, longitude: -47.9318, weight: 10 },
  { latitude: -15.7786, longitude: -47.9307, weight: 11 }
];

const MOCK_POLICE_UNITS = [
  { id: "viatura_1", coordinate: { latitude: -15.785, longitude: -47.925 } },
  { id: "viatura_2", coordinate: { latitude: -15.775, longitude: -47.935 } }
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
          <Heatmap
            points={HEATMAP_POINTS}
            opacity={0.7}
            radius={50}
            gradient={{
              colors: ["#79f279", "#f2f279", "#f27979"],
              startPoints: [0.05, 0.4, 1.0],
              colorMapSize: 256
            }}
          />
        )}

        {viewMode === "user" && currentLocation && (
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

        {points.map((point) => (
          <MapMarker key={point.id} pointData={point} />
        ))}

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
    padding: 5,
    borderWidth: 2,
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
    padding: 4,
    flexDirection: "row",
    alignItems: "center",
    elevation: 5
  },
  mapActionControls: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 25,
    padding: 4,
    flexDirection: "row",
    alignItems: "center",
    elevation: 5,
    marginTop: Layout.spacing.s
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
    elevation: 5
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
