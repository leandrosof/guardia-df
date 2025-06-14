import React, { createContext, useState, useEffect, useContext } from "react";
import { Alert } from "react-native";

// Constantes da simulação
const DANGER_RADIUS_METERS = 500;
const SIMULATION_INTERVAL_MS = 3000;
const AGGRESSOR_STEP_METERS = 70;
const USER_ESCAPE_STEP_METERS = 80;
const POLICE_STEP_METERS = 150;
const SAFE_POINT_REACHED_THRESHOLD = 30;
const POLICE_ARRIVAL_THRESHOLD = 50;

// Dados iniciais
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

const INITIAL_POLICE_UNITS = [
  { id: "viatura_1", coordinate: { latitude: -15.785, longitude: -47.925 } },
  { id: "viatura_2", coordinate: { latitude: -15.775, longitude: -47.935 } }
];

const MOCK_SAFE_POINTS_FOR_ROUTE = [
  {
    id: "safe_route_1",
    coordinate: { latitude: -15.7915, longitude: -47.9405 }
  },
  {
    id: "safe_route_2",
    coordinate: { latitude: -15.769, longitude: -47.9175 }
  },
  {
    id: "safe_route_3",
    coordinate: {
      latitude: -15.799,
      longitude: -47.95
    }
  }
];

// Funções auxiliares
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

function calculateSmoothedRoute(start, end) {
  return [
    start,
    {
      latitude: (start.latitude + end.latitude) / 2,
      longitude: (start.longitude + end.longitude) / 2
    },
    end
  ];
}

export const EmergencyContext = createContext();

export const EmergencyProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState(
    SIMULATED_INITIAL_USER_LOCATION
  );
  const [simulatedAggressor, setSimulatedAggressor] = useState(
    JSON.parse(JSON.stringify(INITIAL_AGGRESSOR_STATE))
  );
  const [policeUnits, setPoliceUnits] = useState(
    JSON.parse(JSON.stringify(INITIAL_POLICE_UNITS))
  );
  const [proximityAlert, setProximityAlert] = useState({
    isActive: false,
    aggressor: null
  });
  const [escapeRoute, setEscapeRoute] = useState(null);
  const [dispatchRoute, setDispatchRoute] = useState(null);
  const [interceptRoute, setInterceptRoute] = useState(null);
  const [aggressorBehavior, setAggressorBehavior] = useState("pursuing");
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [hasReachedSafety, setHasReachedSafety] = useState(false);

  const pauseSimulation = () => setIsSimulationRunning(false);
  const resumeSimulation = () => setIsSimulationRunning(true);

  const resetSimulation = () => {
    setIsSimulationRunning(false);
    setAggressorBehavior("pursuing");
    setProximityAlert({ isActive: false, aggressor: null });
    setEscapeRoute(null);
    setDispatchRoute(null);
    setInterceptRoute(null);
    setHasReachedSafety(false);
    setSimulatedAggressor(JSON.parse(JSON.stringify(INITIAL_AGGRESSOR_STATE)));
    setCurrentLocation(SIMULATED_INITIAL_USER_LOCATION);
    setPoliceUnits(JSON.parse(JSON.stringify(INITIAL_POLICE_UNITS)));
    Alert.alert("Simulação Resetada");
  };

  useEffect(() => {
    if (isEmergencyActive || !isSimulationRunning) return;

    const intervalId = setInterval(() => {
      let nextUserLocation = { ...currentLocation };
      let nextAggressor = { ...simulatedAggressor };
      let nextPoliceUnits = JSON.parse(JSON.stringify(policeUnits));
      let nextAggressorBehavior = aggressorBehavior;
      let nextHasReachedSafety = hasReachedSafety;

      // 1. Movimento da mulher
      if (!hasReachedSafety && escapeRoute) {
        const escapeDestination = escapeRoute[escapeRoute.length - 1];
        const distanceToSafety = getDistanceBetweenCoordinates(
          currentLocation,
          escapeDestination
        );

        if (distanceToSafety <= SAFE_POINT_REACHED_THRESHOLD) {
          nextHasReachedSafety = true;
          nextAggressorBehavior = "fleeing";
          Alert.alert("Segurança alcançada!", "Você chegou ao ponto seguro.");
          setProximityAlert({ isActive: false, aggressor: null });
        } else {
          // Movimento suave e progressivo
          const direction = {
            latitude: escapeDestination.latitude - currentLocation.latitude,
            longitude: escapeDestination.longitude - currentLocation.longitude
          };

          const magnitude = Math.sqrt(
            direction.latitude * direction.latitude +
              direction.longitude * direction.longitude
          );

          if (magnitude > 0) {
            const normalizedDirection = {
              latitude: direction.latitude / magnitude,
              longitude: direction.longitude / magnitude
            };

            const stepSize = USER_ESCAPE_STEP_METERS / 111000; // Conversão para graus

            nextUserLocation = {
              latitude:
                currentLocation.latitude +
                normalizedDirection.latitude * stepSize,
              longitude:
                currentLocation.longitude +
                (normalizedDirection.longitude * stepSize) /
                  Math.cos((currentLocation.latitude * Math.PI) / 180)
            };
          }
        }
      }

      // 2. Movimento do agressor
      if (nextHasReachedSafety) {
        // Agressor foge em direção oposta ao ponto seguro
        const safePoint =
          escapeRoute?.[escapeRoute.length - 1] || currentLocation;
        const fleeDirection = {
          latitude: nextAggressor.location.latitude - safePoint.latitude,
          longitude: nextAggressor.location.longitude - safePoint.longitude
        };

        const magnitude = Math.sqrt(
          fleeDirection.latitude * fleeDirection.latitude +
            fleeDirection.longitude * fleeDirection.longitude
        );

        if (magnitude > 0) {
          const normalizedDirection = {
            latitude: fleeDirection.latitude / magnitude,
            longitude: fleeDirection.longitude / magnitude
          };

          const stepSize = (AGGRESSOR_STEP_METERS * 1.5) / 111000; // Foge mais rápido

          nextAggressor.location = {
            latitude:
              nextAggressor.location.latitude +
              normalizedDirection.latitude * stepSize,
            longitude:
              nextAggressor.location.longitude +
              (normalizedDirection.longitude * stepSize) /
                Math.cos((nextAggressor.location.latitude * Math.PI) / 180)
          };
        }
      } else {
        // Perseguição normal
        const direction = {
          latitude: nextUserLocation.latitude - nextAggressor.location.latitude,
          longitude:
            nextUserLocation.longitude - nextAggressor.location.longitude
        };

        const magnitude = Math.sqrt(
          direction.latitude * direction.latitude +
            direction.longitude * direction.longitude
        );

        if (magnitude > 0) {
          const normalizedDirection = {
            latitude: direction.latitude / magnitude,
            longitude: direction.longitude / magnitude
          };

          const stepSize = AGGRESSOR_STEP_METERS / 111000;

          nextAggressor.location = {
            latitude:
              nextAggressor.location.latitude +
              normalizedDirection.latitude * stepSize,
            longitude:
              nextAggressor.location.longitude +
              (normalizedDirection.longitude * stepSize) /
                Math.cos((nextAggressor.location.latitude * Math.PI) / 180)
          };
        }
      }

      // 3. Movimento das viaturas
      if (proximityAlert.isActive || hasReachedSafety) {
        // Viatura 1 (só se move se vítima não está segura)
        if (!nextHasReachedSafety) {
          const rescueTarget = nextUserLocation;
          const v1_dist = getDistanceBetweenCoordinates(
            nextPoliceUnits[0].coordinate,
            rescueTarget
          );

          if (v1_dist > POLICE_ARRIVAL_THRESHOLD) {
            const latDiff =
              rescueTarget.latitude - nextPoliceUnits[0].coordinate.latitude;
            const lonDiff =
              rescueTarget.longitude - nextPoliceUnits[0].coordinate.longitude;
            const magnitude = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);

            if (magnitude > 0) {
              const step = POLICE_STEP_METERS / 111000;
              nextPoliceUnits[0].coordinate.latitude +=
                (latDiff / magnitude) * step;
              nextPoliceUnits[0].coordinate.longitude +=
                (lonDiff / magnitude) *
                (step / Math.cos((rescueTarget.latitude * Math.PI) / 180));
            }
          }
        }

        // Viatura 2 (sempre persegue o agressor)
        const interceptTarget = nextAggressor.location;
        const v2_dist = getDistanceBetweenCoordinates(
          nextPoliceUnits[1].coordinate,
          interceptTarget
        );

        if (v2_dist > POLICE_ARRIVAL_THRESHOLD) {
          const latDiff =
            interceptTarget.latitude - nextPoliceUnits[1].coordinate.latitude;
          const lonDiff =
            interceptTarget.longitude - nextPoliceUnits[1].coordinate.longitude;
          const magnitude = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);

          if (magnitude > 0) {
            const step = POLICE_STEP_METERS / 111000;
            nextPoliceUnits[1].coordinate.latitude +=
              (latDiff / magnitude) * step;
            nextPoliceUnits[1].coordinate.longitude +=
              (lonDiff / magnitude) *
              (step / Math.cos((interceptTarget.latitude * Math.PI) / 180));
          }
        }
      }

      // 4. Atualização de estados e rotas
      const finalDistance = getDistanceBetweenCoordinates(
        nextUserLocation,
        nextAggressor.location
      );
      const isClose = finalDistance < DANGER_RADIUS_METERS;

      if (isClose && !nextHasReachedSafety) {
        if (!proximityAlert.isActive) {
          Alert.alert(
            "ALERTA DE PROXIMIDADE!",
            `Agressor detectado a ${finalDistance.toFixed(0)}m.`
          );

          // Calcula rota para o ponto seguro mais próximo
          let closestSafePoint = null;
          let minDistance = Infinity;
          MOCK_SAFE_POINTS_FOR_ROUTE.forEach((point) => {
            const dist = getDistanceBetweenCoordinates(
              nextUserLocation,
              point.coordinate
            );
            if (dist < minDistance) {
              minDistance = dist;
              closestSafePoint = point;
            }
          });

          if (closestSafePoint) {
            setEscapeRoute(
              calculateSmoothedRoute(
                nextUserLocation,
                closestSafePoint.coordinate
              )
            );
          }
        }

        setProximityAlert({
          isActive: true,
          aggressor: { ...nextAggressor, distance: finalDistance }
        });

        // Atualiza rotas policiais
        setDispatchRoute(
          calculateSmoothedRoute(
            nextPoliceUnits[0].coordinate,
            nextUserLocation
          )
        );
        setInterceptRoute(
          calculateSmoothedRoute(
            nextPoliceUnits[1].coordinate,
            nextAggressor.location
          )
        );
      } else if (!isClose && proximityAlert.isActive && !nextHasReachedSafety) {
        setProximityAlert({ isActive: false, aggressor: null });
        setEscapeRoute(null);
        setDispatchRoute(null);
      }

      // Atualiza rota de interceptação continuamente se a vítima está segura
      if (nextHasReachedSafety) {
        setInterceptRoute(
          calculateSmoothedRoute(
            nextPoliceUnits[1].coordinate,
            nextAggressor.location
          )
        );
      }

      // Atualiza todos os estados
      setCurrentLocation(nextUserLocation);
      setSimulatedAggressor(nextAggressor);
      setPoliceUnits(nextPoliceUnits);
      setAggressorBehavior(nextAggressorBehavior);
      setHasReachedSafety(nextHasReachedSafety);
    }, SIMULATION_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [
    isEmergencyActive,
    isSimulationRunning,
    currentLocation,
    simulatedAggressor,
    policeUnits,
    proximityAlert,
    escapeRoute,
    aggressorBehavior,
    hasReachedSafety
  ]);

  const triggerEmergency = (source = "Botão do App") => {
    Alert.alert(
      "EMERGÊNCIA ACIONADA!",
      `Fonte: ${source}.\nAutoridades e contatos notificados.`
    );
    // Para a simulação, pausamos a perseguição para focar no pânico principal
    setIsEmergencyActive(true);
    setIsSimulationRunning(false);
  };

  const cancelEmergency = () => {
    Alert.alert("Emergência Cancelada", "Você marcou que está bem.");
    setIsEmergencyActive(false);
  };

  return (
    <EmergencyContext.Provider
      value={{
        isEmergencyActive,
        triggerEmergency,
        cancelEmergency,
        currentLocation,
        simulatedAggressor,
        policeUnits,
        proximityAlert,
        escapeRoute,
        dispatchRoute,
        interceptRoute,
        isSimulationRunning,
        hasReachedSafety,
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
