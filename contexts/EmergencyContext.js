// contexts/EmergencyContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import { Alert, AppState } from "react-native";
import Colors from "../constants/Colors";

const theme = Colors.light;

const DANGER_RADIUS_METERS = 500;
const SIMULATION_INTERVAL_MS = 3000;
const AGGRESSOR_STEP_METERS = 15;
const USER_ESCAPE_STEP_METERS = 30;
const SAFE_POINT_REACHED_THRESHOLD = 50;
const MIN_DISTANCE_TO_USER_METERS = 200;

const SIMULATED_INITIAL_USER_LOCATION = {
  latitude: -15.780148,
  longitude: -47.929169
};

const INITIAL_AGGRESSOR_STATE = {
  id: "agressor001",
  name: "Ag. Simul. Perseguidor",
  location: {
    latitude: SIMULATED_INITIAL_USER_LOCATION.latitude + 0.004,
    longitude: SIMULATED_INITIAL_USER_LOCATION.longitude + 0.004
  }
};

// Pontos seguros usados pelo contexto para calcular a rota de fuga mais próxima
const MOCK_SAFE_POINTS_FOR_ROUTE = [
  {
    id: "safe_point_1",
    coordinate: { latitude: -15.7815, longitude: -47.9305 }
  },
  { id: "safe_point_2", coordinate: { latitude: -15.779, longitude: -47.9275 } }
];

function getDistanceBetweenCoordinates(coord1, coord2) {
  if (!coord1 || !coord2) return Infinity;
  const R = 6371e3;
  const toRadians = (deg) => deg * (Math.PI / 180);
  const phi1 = toRadians(coord1.latitude);
  const phi2 = toRadians(coord2.latitude);
  const deltaPhi = toRadians(coord2.latitude - coord1.latitude);
  const deltaLambda = toRadians(coord2.longitude - coord1.longitude);
  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) *
      Math.cos(phi2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const EmergencyContext = createContext();

export const EmergencyProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState(
    SIMULATED_INITIAL_USER_LOCATION
  );
  const [simulatedAggressor, setSimulatedAggressor] = useState(
    JSON.parse(JSON.stringify(INITIAL_AGGRESSOR_STATE))
  );
  const [proximityAlert, setProximityAlert] = useState({
    isActive: false,
    aggressor: null
  });
  const [escapeRoute, setEscapeRoute] = useState(null);
  const [aggressorBehavior, setAggressorBehavior] = useState("pursuing");
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);

  const pauseSimulation = () => setIsSimulationRunning(false);
  const resumeSimulation = () => setIsSimulationRunning(true);

  const resetSimulation = () => {
    setIsSimulationRunning(false);
    setAggressorBehavior("pursuing");
    setProximityAlert({ isActive: false, aggressor: null });
    setEscapeRoute(null);
    setSimulatedAggressor(JSON.parse(JSON.stringify(INITIAL_AGGRESSOR_STATE)));
    setCurrentLocation(SIMULATED_INITIAL_USER_LOCATION);
    Alert.alert("Simulação Resetada");
  };

  useEffect(() => {
    if (isEmergencyActive || !isSimulationRunning) {
      return;
    }

    const intervalId = setInterval(() => {
      let nextUserLocation = { ...currentLocation };
      let nextAggressor = { ...simulatedAggressor };

      if (proximityAlert.isActive && escapeRoute) {
        const escapeDestination = escapeRoute[1];
        const distanceToSafety = getDistanceBetweenCoordinates(
          currentLocation,
          escapeDestination
        );

        if (distanceToSafety <= SAFE_POINT_REACHED_THRESHOLD) {
          Alert.alert("Você está em Segurança!", "A ameaça foi neutralizada.");
          setProximityAlert({ isActive: false, aggressor: null });
          setEscapeRoute(null);
          setAggressorBehavior("fleeing"); // Comportamento do agressor muda para "recuando"
        } else {
          const latDiff = escapeDestination.latitude - currentLocation.latitude;
          const lonDiff =
            escapeDestination.longitude - currentLocation.longitude;
          const magnitude = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
          if (magnitude > 0) {
            const stepLat =
              (latDiff / magnitude) * (USER_ESCAPE_STEP_METERS / 111000);
            const stepLon =
              (lonDiff / magnitude) *
              (USER_ESCAPE_STEP_METERS /
                (111000 *
                  Math.cos((currentLocation.latitude * Math.PI) / 180)));
            nextUserLocation = {
              latitude: currentLocation.latitude + stepLat,
              longitude: currentLocation.longitude + stepLon
            };
          }
        }
      }

      if (aggressorBehavior === "pursuing") {
        const distanceToUser = getDistanceBetweenCoordinates(
          nextUserLocation,
          nextAggressor.location
        );
        if (distanceToUser > MIN_DISTANCE_TO_USER_METERS) {
          const latDiff =
            nextUserLocation.latitude - nextAggressor.location.latitude;
          const lonDiff =
            nextUserLocation.longitude - nextAggressor.location.longitude;
          const magnitude = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
          if (magnitude > 0) {
            const stepLat =
              (latDiff / magnitude) * (AGGRESSOR_STEP_METERS / 111000);
            const stepLon =
              (lonDiff / magnitude) *
              (AGGRESSOR_STEP_METERS /
                (111000 *
                  Math.cos((nextUserLocation.latitude * Math.PI) / 180)));
            nextAggressor.location = {
              latitude: nextAggressor.location.latitude + stepLat,
              longitude: nextAggressor.location.longitude + stepLon
            };
          }
        }
      } else if (aggressorBehavior === "fleeing") {
        const latDiff =
          nextAggressor.location.latitude - nextUserLocation.latitude;
        const lonDiff =
          nextAggressor.location.longitude - nextUserLocation.longitude;
        const magnitude = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
        if (magnitude > 0) {
          const stepLat =
            (latDiff / magnitude) * (AGGRESSOR_STEP_METERS / 111000);
          const stepLon =
            (lonDiff / magnitude) *
            (AGGRESSOR_STEP_METERS /
              (111000 * Math.cos((nextUserLocation.latitude * Math.PI) / 180)));
          nextAggressor.location = {
            latitude: nextAggressor.location.latitude + stepLat,
            longitude: nextAggressor.location.longitude + stepLon
          };
        }
      }

      const finalDistanceToUser = getDistanceBetweenCoordinates(
        nextUserLocation,
        nextAggressor.location
      );
      if (
        !proximityAlert.isActive &&
        finalDistanceToUser < DANGER_RADIUS_METERS
      ) {
        Alert.alert(
          "ALERTA DE PROXIMIDADE!",
          `Agressor detectado a ${finalDistanceToUser.toFixed(0)}m.`
        );
        setProximityAlert({
          isActive: true,
          aggressor: { ...nextAggressor, distance: finalDistanceToUser }
        });

        let closestSafePoint = null;
        let minDistance = Infinity;
        MOCK_SAFE_POINTS_FOR_ROUTE.forEach((point) => {
          const distance = getDistanceBetweenCoordinates(
            nextUserLocation,
            point.coordinate
          );
          if (distance < minDistance) {
            minDistance = distance;
            closestSafePoint = point;
          }
        });
        if (closestSafePoint) {
          setEscapeRoute([nextUserLocation, closestSafePoint.coordinate]);
        }
      } else if (proximityAlert.isActive) {
        setProximityAlert((prev) => ({
          ...prev,
          aggressor: { ...prev.aggressor, distance: finalDistanceToUser }
        }));
      }

      setCurrentLocation(nextUserLocation);
      setSimulatedAggressor(nextAggressor);
    }, SIMULATION_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [
    isEmergencyActive,
    isSimulationRunning,
    currentLocation,
    simulatedAggressor,
    proximityAlert,
    escapeRoute,
    aggressorBehavior
  ]);

  return (
    <EmergencyContext.Provider
      value={{
        isEmergencyActive,
        currentLocation,
        simulatedAggressor,
        proximityAlert,
        escapeRoute,
        isSimulationRunning,
        pauseSimulation,
        resumeSimulation,
        resetSimulation
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
};

export const useEmergency = () => useContext(EmergencyContext);
