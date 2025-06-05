// contexts/EmergencyContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
// import * as Location from 'expo-location'; // Não usaremos para a localização da mulher
import * as SMS from "expo-sms";
import { Accelerometer } from "expo-sensors";
import { Alert, AppState, Platform } from "react-native";
// import * as TaskManager from 'expo-task-manager'; // Não usaremos para a localização da mulher
import Colors from "../constants/Colors";

const theme = Colors.light;

// const LOCATION_TASK_NAME = "background-location-task"; // Não mais necessário para a usuária
const SHAKE_THRESHOLD = 1.8;
const SHAKE_DEBOUNCE_TIME = 1000;
let lastShakeTimestamp = 0;

const DANGER_RADIUS_METERS = 500;
const PROXIMITY_CHECK_INTERVAL_MS = 7000;
const AGGRESSOR_STEP_METERS = 50;
const MIN_DISTANCE_TO_USER_METERS = 20;

// Localização simulada FIXA para a mulher em Brasília
const SIMULATED_USER_LOCATION = {
  latitude: -15.780148, // Ex: Perto da Esplanada dos Ministérios
  longitude: -47.929169,
  accuracy: 5, // Apenas para ter um valor
  altitude: null,
  altitudeAccuracy: null,
  heading: null,
  speed: null
};

function getDistanceBetweenCoordinates(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const toRadians = (deg) => deg * (Math.PI / 180);
  const phi1 = toRadians(lat1);
  const phi2 = toRadians(lat2);
  const deltaPhi = toRadians(lat2 - lat1);
  const deltaLambda = toRadians(lon2 - lon1);
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

// TaskManager.defineTask(LOCATION_TASK_NAME, ...); // Não mais necessário para a usuária

export const EmergencyProvider = ({ children }) => {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  // AGORA currentLocation é a nossa localização simulada e fixa para a "mulher"
  const [currentLocation, setCurrentLocation] = useState(
    SIMULATED_USER_LOCATION
  );
  const [emergencyContacts, setEmergencyContacts] = useState([
    { id: "1", name: "Mamãe (Exemplo)", phone: "5561999999999" }
  ]);
  const [shakeDetectionEnabled, setShakeDetectionEnabled] = useState(true);
  const [appState, setAppState] = useState(AppState.currentState);

  const [simulatedAggressors, setSimulatedAggressors] = useState([
    {
      id: "agressor001",
      name: "Ag. Simul. Perseguidor",
      // Posição inicial um pouco mais distante da SIMULATED_USER_LOCATION
      location: {
        latitude: SIMULATED_USER_LOCATION.latitude + 0.005,
        longitude: SIMULATED_USER_LOCATION.longitude + 0.005
      }
    }
  ]);

  const [proximityAlert, setProximityAlert] = useState({
    isActive: false,
    aggressor: null
  });

  useEffect(() => {
    // Apenas para logar a localização simulada da usuária ao iniciar
    console.log(
      "[CONTEXT] Localização SIMULADA da usuária definida para:",
      currentLocation
    );
  }, [currentLocation]); // Dependência em currentLocation para caso você queira mudá-la dinamicamente por outro meio no futuro

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      setAppState(nextAppState);
    });
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (!shakeDetectionEnabled) {
      Accelerometer.removeAllListeners();
      return;
    }
    let subscription;
    const _subscribeShake = () => {
      subscription = Accelerometer.addListener((accelerometerData) => {
        const { x, y, z } = accelerometerData;
        const totalForce = Math.sqrt(x * x + y * y + z * z);
        const now = Date.now();
        if (totalForce > SHAKE_THRESHOLD) {
          if (now - lastShakeTimestamp > SHAKE_DEBOUNCE_TIME) {
            lastShakeTimestamp = now;
            // ... (lógica do shake)
            triggerEmergency("Shake (Botão Guardião Simulado)");
          }
        }
      });
      Accelerometer.setUpdateInterval(100);
    };
    _subscribeShake();
    return () => {
      subscription?.remove();
    };
  }, [shakeDetectionEnabled, appState]);

  // Funções de permissão e rastreamento de localização foram REMOVIDAS ou SIMPLIFICADAS
  // pois não precisamos mais buscar a localização real da mulher para a simulação principal.
  // Mantemos uma função de permissão apenas caso alguma outra parte do app precise (ex: o botão "minha localização" do MapView).
  const requestLocationPermissionsForMapFeature = async () => {
    // Esta função é opcional, apenas se você quiser que o MapView.showsUserLocation funcione independentemente
    // let { status } = await Location.requestForegroundPermissionsAsync();
    // if (status !== 'granted') {
    //   Alert.alert('Permissão Opcional', 'Permissão de localização negada. O mapa pode não mostrar sua posição real (ponto azul).');
    //   return false;
    // }
    // return true;
    console.log(
      "[CONTEXT] requestLocationPermissionsForMapFeature: Simulação não usa GPS real da usuária, mas permissão pode ser pedida pelo MapView."
    );
    return true; // Simula que foi concedida ou não é bloqueante para a simulação principal
  };

  const triggerEmergency = async (source = "Botão do App") => {
    if (isEmergencyActive) return;
    setIsEmergencyActive(true);
    Alert.alert(
      "EMERGÊNCIA ACIONADA!",
      `Fonte: ${source}.\nLocalização (simulada) compartilhada. Contatos notificados.`
    );
    console.log(`[ALERTA SISTEMA] EMERGÊNCIA ACIONADA via: ${source}`);
    // Não precisamos chamar startLocationTracking(true) para a localização da mulher, pois ela é simulada e fixa.
    // A localização do *agressor* é que se move dinamicamente.

    // Lógica de SMS (usa o currentLocation que é o simulado)
    if (emergencyContacts.length > 0 && currentLocation) {
      const isSmsAvailable = await SMS.isAvailableAsync();
      if (isSmsAvailable) {
        emergencyContacts.forEach((contact) => {
          const message = `ALERTA GUARDIÃ DF: ${
            contact.name.split(" ")[0]
          }, AJUDA URGENTE! Minha localização (simulada): https://maps.google.com/?q=${
            currentLocation.latitude
          },${currentLocation.longitude}`;
          SMS.sendSMSAsync(contact.phone, message)
            .then((result) =>
              console.log(
                `[SMS] Alerta enviado para ${contact.name}: ${result.result}`
              )
            )
            .catch((error) =>
              console.warn(`[SMS] Erro ao enviar para ${contact.name}:`, error)
            );
        });
      } else {
        Alert.alert(
          "SMS Indisponível",
          "Não é possível notificar contatos via SMS."
        );
      }
    }
  };

  const cancelEmergency = async () => {
    if (!isEmergencyActive) return;
    setIsEmergencyActive(false);
    Alert.alert("Emergência Cancelada", "Você marcou que está bem.");
    console.log('[ALERTA SISTEMA] EMERGÊNCIA CANCELADA ("Estou Bem")');
    // ... (lógica de SMS "Estou Bem")
  };

  // simulateVolumePressForPitch (sem alterações)
  const simulateVolumePressForPitch = () => {
    /* ... */
  };

  const moveSimulatedAggressor = (aggressorId, newLocation) => {
    setSimulatedAggressors((prevAggressors) =>
      prevAggressors.map((ag) =>
        ag.id === aggressorId ? { ...ag, location: newLocation } : ag
      )
    );
  };

  // Efeito para MOVIMENTAR agressor E VERIFICAR proximidade (em relação à currentLocation SIMULADA)
  useEffect(() => {
    // currentLocation é o SIMULATED_USER_LOCATION, que é fixo mas válido.
    if (
      !currentLocation ||
      simulatedAggressors.length === 0 ||
      isEmergencyActive
    ) {
      if (proximityAlert.isActive) {
        setProximityAlert({ isActive: false, aggressor: null });
      }
      return;
    }

    const intervalId = setInterval(() => {
      const aggressorToMove = simulatedAggressors[0];
      let newAggressorLocation = { ...aggressorToMove.location }; // Começa com a localização atual do agressor

      const distanceToUser = getDistanceBetweenCoordinates(
        currentLocation.latitude,
        currentLocation.longitude,
        aggressorToMove.location.latitude,
        aggressorToMove.location.longitude
      );

      if (distanceToUser > MIN_DISTANCE_TO_USER_METERS) {
        const latDiff =
          currentLocation.latitude - aggressorToMove.location.latitude;
        const lonDiff =
          currentLocation.longitude - aggressorToMove.location.longitude;
        const magnitude = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);

        if (magnitude > 0) {
          // Evita divisão por zero se estiverem no mesmo ponto
          const stepLat =
            (latDiff / magnitude) * (AGGRESSOR_STEP_METERS / 111000);
          const stepLon =
            (lonDiff / magnitude) *
            (AGGRESSOR_STEP_METERS /
              (111000 * Math.cos((currentLocation.latitude * Math.PI) / 180)));

          newAggressorLocation = {
            latitude: aggressorToMove.location.latitude + stepLat,
            longitude: aggressorToMove.location.longitude + stepLon
          };
        }
      }
      // Atualiza o estado do agressor com a nova localização (mesmo que não tenha se movido se já estiver perto)
      setSimulatedAggressors((prev) => [
        { ...prev[0], location: newAggressorLocation }
      ]);

      // Verificar proximidade com a NOVA localização do agressor
      let closestDangerousAggressor = null;
      let minDistanceFound = Infinity;
      const currentAggressorState = {
        ...aggressorToMove,
        location: newAggressorLocation
      };
      const finalDistanceToUser = getDistanceBetweenCoordinates(
        currentLocation.latitude,
        currentLocation.longitude,
        currentAggressorState.location.latitude,
        currentAggressorState.location.longitude
      );

      if (finalDistanceToUser < DANGER_RADIUS_METERS) {
        minDistanceFound = finalDistanceToUser;
        closestDangerousAggressor = {
          ...currentAggressorState,
          distance: minDistanceFound
        };
      }

      if (closestDangerousAggressor) {
        if (
          !proximityAlert.isActive ||
          proximityAlert.aggressor?.id !== closestDangerousAggressor.id
        ) {
          console.warn(
            `[CONTEXT ALERT PROXIMITY] ATIVADO! ${
              closestDangerousAggressor.name
            } a ${minDistanceFound.toFixed(0)}m da usuária (simulada).`
          );
          Alert.alert(
            "ALERTA DE PROXIMIDADE!",
            `Agressor "${
              closestDangerousAggressor.name
            }" detectado a ${minDistanceFound.toFixed(0)}m.`
          );
          setProximityAlert({
            isActive: true,
            aggressor: closestDangerousAggressor
          });
        } else if (
          proximityAlert.isActive &&
          proximityAlert.aggressor?.id === closestDangerousAggressor.id
        ) {
          setProximityAlert((prev) => ({
            ...prev,
            aggressor: { ...closestDangerousAggressor }
          })); // Atualiza distância
        }
      } else {
        if (proximityAlert.isActive) {
          console.info("[CONTEXT ALERT PROXIMITY] DESATIVADO.");
          setProximityAlert({ isActive: false, aggressor: null });
        }
      }
    }, PROXIMITY_CHECK_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [
    currentLocation,
    simulatedAggressors,
    proximityAlert.isActive,
    isEmergencyActive
  ]);

  return (
    <EmergencyContext.Provider
      value={{
        isEmergencyActive,
        currentLocation, // currentLocation é a SIMULADA
        emergencyContacts,
        shakeDetectionEnabled,
        triggerEmergency,
        cancelEmergency,
        setEmergencyContacts,
        setShakeDetectionEnabled,
        simulateVolumePressForPitch,
        requestLocationPermissionsForMapFeature, // Nome mudado para clareza
        // startLocationTracking, // Não é mais necessário expor para a usuária
        simulatedAggressors,
        moveSimulatedAggressor,
        proximityAlert
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
};

export const useEmergency = () => useContext(EmergencyContext);
