// contexts/EmergencyContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import { Alert, AppState } from "react-native";
import Colors from "../constants/Colors";

const theme = Colors.light;

// --- CONSTANTES DA SIMULAÇÃO ---
const DANGER_RADIUS_METERS = 500;
const SIMULATION_INTERVAL_MS = 3000;
const AGGRESSOR_STEP_METERS = 70;
const USER_ESCAPE_STEP_METERS = 90;
const SAFE_POINT_REACHED_THRESHOLD = 50;
const MIN_DISTANCE_TO_USER_METERS = 200; // Conforme seu ajuste!

const SIMULATED_INITIAL_USER_LOCATION = {
  latitude: -15.780148,
  longitude: -47.929169
};

const INITIAL_AGGRESSOR_STATE = {
  id: "agressor001",
  name: "Ag. Simul. Perseguidor",
  location: {
    latitude: SIMULATED_INITIAL_USER_LOCATION.latitude + 0.008,
    longitude: SIMULATED_INITIAL_USER_LOCATION.longitude + 0.008
  }
};

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
  // NOVO ESTADO para controlar o comportamento do agressor
  const [aggressorBehavior, setAggressorBehavior] = useState("pursuing"); // pode ser 'pursuing', 'fleeing' ou 'idle'

  // ... (outros estados e useEffects de AppState e Shake mantidos)
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  // ...

  const resetSimulation = () => {
    console.log("[SIMULAÇÃO] Resetando posições e comportamento.");
    setCurrentLocation(SIMULATED_INITIAL_USER_LOCATION);
    setSimulatedAggressor(JSON.parse(JSON.stringify(INITIAL_AGGRESSOR_STATE)));
    setProximityAlert({ isActive: false, aggressor: null });
    setEscapeRoute(null);
    setAggressorBehavior("pursuing"); // Reseta o comportamento para 'perseguindo'
    Alert.alert(
      "Simulação Resetada",
      "A posição da usuária e do agressor foram restauradas."
    );
  };

  // O useEffect principal que controla a simulação
  useEffect(() => {
    if (isEmergencyActive) return;

    const intervalId = setInterval(() => {
      let newAggressorLocation = { ...simulatedAggressor.location };
      let newUserLocation = { ...currentLocation };
      let newEscapeRoute = escapeRoute;
      let newProximityAlert = { ...proximityAlert };
      let newAggressorBehavior = aggressorBehavior;

      const distanceToUser = getDistanceBetweenCoordinates(
        currentLocation,
        simulatedAggressor.location
      );

      // --- LÓGICA DE FUGA DA MULHER (se o alerta de proximidade estiver ativo) ---
      if (proximityAlert.isActive && escapeRoute) {
        const escapeDestination = escapeRoute[1];
        const distanceToSafety = getDistanceBetweenCoordinates(
          currentLocation,
          escapeDestination
        );

        if (distanceToSafety <= SAFE_POINT_REACHED_THRESHOLD) {
          // CHEGOU AO PONTO SEGURO!
          console.log(
            "[SIMULAÇÃO] Usuária alcançou o ponto seguro! Alerta finalizado."
          );
          Alert.alert(
            "Você está em Segurança!",
            "Você alcançou um ponto de apoio próximo. A ameaça foi neutralizada."
          );
          newProximityAlert = { isActive: false, aggressor: null };
          newEscapeRoute = null;
          newAggressorBehavior = "fleeing"; // NOVO: Manda o agressor recuar
        } else {
          // Continua movendo a mulher na rota de fuga
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
            newUserLocation = {
              latitude: currentLocation.latitude + stepLat,
              longitude: currentLocation.longitude + stepLon
            };
          }
        }
      }

      // --- LÓGICA DE MOVIMENTO DO AGRESSOR (baseada no comportamento) ---
      if (newAggressorBehavior === "pursuing") {
        // Move em direção à mulher
        const aggressorTarget = newUserLocation; // Persegue a posição atual ou futura da mulher
        const aggDistanceToTarget = getDistanceBetweenCoordinates(
          aggressorTarget,
          newAggressorLocation
        );
        if (aggDistanceToTarget > MIN_DISTANCE_TO_USER_METERS) {
          const latDiff =
            aggressorTarget.latitude - newAggressorLocation.latitude;
          const lonDiff =
            aggressorTarget.longitude - newAggressorLocation.longitude;
          const magnitude = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
          if (magnitude > 0) {
            const stepLat =
              (latDiff / magnitude) * (AGGRESSOR_STEP_METERS / 111000);
            const stepLon =
              (lonDiff / magnitude) *
              (AGGRESSOR_STEP_METERS /
                (111000 *
                  Math.cos((aggressorTarget.latitude * Math.PI) / 180)));
            newAggressorLocation = {
              latitude: newAggressorLocation.latitude + stepLat,
              longitude: newAggressorLocation.longitude + stepLon
            };
          }
        }
      } else if (newAggressorBehavior === "fleeing") {
        // NOVO: Move na direção OPOSTA à mulher
        const latDiff =
          newAggressorLocation.latitude - newUserLocation.latitude;
        const lonDiff =
          newAggressorLocation.longitude - newUserLocation.longitude;
        const magnitude = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
        if (magnitude > 0) {
          const stepLat =
            (latDiff / magnitude) * (AGGRESSOR_STEP_METERS / 111000);
          const stepLon =
            (lonDiff / magnitude) *
            (AGGRESSOR_STEP_METERS /
              (111000 * Math.cos((newUserLocation.latitude * Math.PI) / 180)));
          newAggressorLocation = {
            latitude: newAggressorLocation.latitude + stepLat,
            longitude: newAggressorLocation.longitude + stepLon
          };
        }
      }

      // --- LÓGICA PARA ATIVAR O ALERTA (se ainda não estiver ativo) ---
      if (!proximityAlert.isActive && distanceToUser < DANGER_RADIUS_METERS) {
        console.warn(
          `[CONTEXT] ALERTA DE PROXIMIDADE ATIVADO! Agressor a ${distanceToUser.toFixed(
            0
          )}m.`
        );
        Alert.alert(
          "ALERTA DE PROXIMIDADE!",
          `Agressor detectado a ${distanceToUser.toFixed(0)}m.`
        );
        newProximityAlert = {
          isActive: true,
          aggressor: { ...simulatedAggressor, distance: distanceToUser }
        };
        // Calcula a rota de fuga pela primeira vez
        const latDiffFromAggressor =
          currentLocation.latitude - newAggressorLocation.latitude;
        const lonDiffFromAggressor =
          currentLocation.longitude - newAggressorLocation.longitude;
        const safePointDestination = {
          latitude: currentLocation.latitude + latDiffFromAggressor * 2.0, // Aumentei o multiplicador para um ponto de fuga mais distante
          longitude: currentLocation.longitude + lonDiffFromAggressor * 2.0
        };
        newEscapeRoute = [currentLocation, safePointDestination];
      }

      // Atualiza todos os estados de uma vez no final do ciclo
      setCurrentLocation(newUserLocation);
      setSimulatedAggressor({
        ...simulatedAggressor,
        location: newAggressorLocation
      });
      setProximityAlert(newProximityAlert);
      setEscapeRoute(newEscapeRoute);
      setAggressorBehavior(newAggressorBehavior);
    }, SIMULATION_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [
    currentLocation,
    simulatedAggressor,
    proximityAlert,
    escapeRoute,
    aggressorBehavior,
    isEmergencyActive
  ]);

  return (
    <EmergencyContext.Provider
      value={{
        currentLocation,
        simulatedAggressor,
        proximityAlert,
        escapeRoute,
        resetSimulation
        // ...outras funções como triggerEmergency, etc. que você possa ter.
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
};

export const useEmergency = () => useContext(EmergencyContext);
