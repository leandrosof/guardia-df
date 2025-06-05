// app/(tabs)/map.js
import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, Callout, Circle } from "react-native-maps"; // Adicionado Circle
// import * as Location from "expo-location"; // Não vamos mais buscar localização diretamente aqui

import { useEmergency } from "../../contexts/EmergencyContext";
import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import Typography from "../../constants/Typography";
import GlobalStyles from "../../constants/GlobalStyles";
import Icon from "../../components/Icon";
// Se você criou MapMarker.js e quer usá-lo para mockPoints:
// import MapMarker from '../../components/MapMarker';

const theme = Colors.light;

const mockPoints = [
  {
    id: "1",
    type: "safe",
    coordinate: { latitude: -15.7998, longitude: -47.8645 },
    title: "DEAM Asa Sul",
    description: "Delegacia Especializada de Atendimento à Mulher"
  },
  {
    id: "2",
    type: "risk",
    coordinate: { latitude: -15.7801, longitude: -47.9292 },
    title: "Área de Risco Exemplo",
    description: "Relatos de assédio nesta área."
  },
  {
    id: "3",
    type: "safe",
    coordinate: { latitude: -15.8345, longitude: -47.998 },
    title: "Posto Policial Comunitário",
    description: "Ponto de apoio policial."
  },
  {
    id: "4",
    type: "safe",
    coordinate: { latitude: -15.7522, longitude: -47.8812 },
    title: "Centro de Referência da Mulher",
    description: "Apoio psicossocial e jurídico."
  },
  {
    id: "5",
    type: "risk",
    coordinate: { latitude: -15.81, longitude: -47.87 },
    title: "Praça Pouco Iluminada",
    description: "Evitar à noite, pouca iluminação."
  }
];

// A função getDistanceBetweenCoordinates precisa estar acessível aqui
// Se ela está no EmergencyContext, você pode exportá-la de lá ou duplicá-la aqui/utils.
// Para este exemplo, vou assumir que ela está disponível (ou você pode copiar do EmergencyContext.js)
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
const DANGER_RADIUS_METERS = 500; // Defina o raio aqui também para o círculo

export default function MapScreen() {
  const {
    currentLocation,
    simulatedAggressors,
    proximityAlert,
    requestPermissionsAndStartLocation,
    startLocationTracking
  } = useEmergency();
  const mapRef = useRef(null);
  const [mapCenteredOnUser, setMapCenteredOnUser] = useState(false);

  // Solicitar permissões e iniciar o rastreamento de localização do contexto ao montar a tela
  useEffect(() => {
    const initLocation = async () => {
      const permissionsGranted = await requestPermissionsAndStartLocation(); // Vem do context
      if (permissionsGranted) {
        startLocationTracking(false); // Inicia o rastreamento padrão (false = não é emergência)
      }
    };
    initLocation();
  }, [requestPermissionsAndStartLocation, startLocationTracking]);

  useEffect(() => {
    if (currentLocation && mapRef.current && !mapCenteredOnUser) {
      mapRef.current.animateToRegion(
        {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.02, // Zoom um pouco mais próximo
          longitudeDelta: 0.01
        },
        1000
      );
      setMapCenteredOnUser(true); // Marcar que centralizamos uma vez
    }
  }, [currentLocation, mapCenteredOnUser]);

  const defaultInitialRegion = {
    latitude: -15.7942, // Centro de Brasília
    longitude: -47.8825,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  };

  const mapInitialRegion = currentLocation
    ? {
        ...currentLocation,
        // --- AJUSTE DE ZOOM AQUI (initialRegion) ---
        latitudeDelta: 0.015, // Zoom inicial um pouco mais próximo também
        longitudeDelta: 0.01
      }
    : {
        latitude: -15.7942,
        longitude: -47.8825, // Brasília (fallback)
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421 // Zoom mais distante para fallback
      };

  return (
    <SafeAreaView
      style={[GlobalStyles.safeAreaContainer, styles.screen]}
      edges={["left", "right", "top"]}
    >
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={mapInitialRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        mapPadding={{ bottom: 80 }} // Para a legenda não cobrir o botão de localização
      >
        {/* Marcador para a localização SIMULADA da mulher */}
        {currentLocation && ( // currentLocation vem do EmergencyContext e é a localização simulada
          <Marker
            coordinate={currentLocation}
            // pinColor={theme.tint} // Podemos usar um ícone customizado em vez do pinColor
            zIndex={200} // Para garantir que fique bem visível, acima de outros pontos se necessário
          >
            {/* Usamos o seu componente Icon para um visual customizado */}
            <Icon
              name="woman-sharp" // Ícone de mulher (Ionicons)
              size={Layout.iconSize.l + 5} // Tamanho um pouco maior
              color={theme.white} // Cor do ícone
              style={{
                // Estilo para dar um fundo e forma ao ícone
                backgroundColor: theme.tint, // Cor de fundo (roxo do tema)
                borderRadius: (Layout.iconSize.l + 5 + 10) / 2, // Para fazer um círculo (tamanho + padding) / 2
                padding: 5, // Espaçamento interno
                borderWidth: 2,
                borderColor: theme.white // Borda branca para destaque
              }}
            />
            <Callout tooltip={false}>
              <View style={styles.calloutView}>
                <Text style={styles.calloutTitle}>Você (Simulado)</Text>
                <Text style={styles.calloutDescription}>
                  Localização simulada
                </Text>
              </View>
            </Callout>
          </Marker>
        )}

        {/* Marcadores de Pontos Seguros/Risco (seu código original está bom) */}
        {mockPoints.map((point) => (
          <Marker key={point.id} coordinate={point.coordinate}>
            <Icon
              name={
                point.type === "safe"
                  ? "shield-checkmark-sharp"
                  : "warning-sharp"
              }
              size={Layout.iconSize.l + 5}
              color={point.type === "safe" ? theme.success : theme.danger}
            />
            <Callout tooltip={false}>
              <View style={styles.calloutView}>
                <Text style={styles.calloutTitle}>{point.title}</Text>
                <Text style={styles.calloutDescription}>
                  {point.description}
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}

        {/* Marcadores dos Agressores Simulados (seu código original está bom) */}
        {simulatedAggressors.map(
          (aggressor) =>
            aggressor.location && (
              <Marker
                key={`aggressor-${aggressor.id}`}
                coordinate={aggressor.location}
                zIndex={
                  proximityAlert.isActive &&
                  proximityAlert.aggressor?.id === aggressor.id
                    ? 100
                    : 10
                }
              >
                <View style={styles.aggressorMarkerContainer}>
                  <Icon
                    name={"skull-sharp"}
                    size={Layout.iconSize.l + 6}
                    color={
                      proximityAlert.isActive &&
                      proximityAlert.aggressor?.id === aggressor.id
                        ? theme.white
                        : theme.black
                    }
                    style={
                      proximityAlert.isActive &&
                      proximityAlert.aggressor?.id === aggressor.id
                        ? styles.alertAggressorIcon
                        : styles.normalAggressorIcon
                    }
                  />
                </View>
                <Callout tooltip={false} style={styles.calloutContainer}>
                  <View style={styles.calloutView}>
                    <Text style={styles.calloutTitle}>
                      Agressor: {aggressor.name}
                    </Text>
                    {currentLocation /* Usar currentLocation do CONTEXTO aqui */ && (
                      <Text style={styles.calloutDescription}>
                        Distância Aprox:{" "}
                        {getDistanceBetweenCoordinates(
                          currentLocation.latitude,
                          currentLocation.longitude,
                          aggressor.location.latitude,
                          aggressor.location.longitude
                        ).toFixed(0)}
                        m
                      </Text>
                    )}
                    {proximityAlert.isActive &&
                      proximityAlert.aggressor?.id === aggressor.id && (
                        <Text
                          style={[
                            styles.calloutDescription,
                            {
                              color: theme.danger,
                              fontFamily: Typography.fontFamilyBold
                            }
                          ]}
                        >
                          PERIGO! PRÓXIMO (
                          {proximityAlert.aggressor.distance.toFixed(0)}m)
                        </Text>
                      )}
                  </View>
                </Callout>
              </Marker>
            )
        )}

        {/* Círculo de Raio de Perigo */}
        <Circle
          center={currentLocation}
          radius={DANGER_RADIUS_METERS} // Os 500 metros que você definiu
          fillColor={
            proximityAlert.isActive && proximityAlert.agressor
              ? "rgba(220, 20, 60, 0.25)" // Vermelho translúcido (perigo)
              : "rgba(46, 139, 87, 0.20)" // Verde translúcido (seguro - SeaGreen)
          }
          strokeColor={
            proximityAlert.isActive && proximityAlert.aggressor
              ? theme.danger // Vermelho opaco (perigo)
              : theme.success // Verde opaco (seguro)
          }
          strokeWidth={2}
          zIndex={50} // Ajuste o zIndex conforme necessário para visibilidade
        />
      </MapView>

      {/* Legenda (seu código original está bom) */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <Icon
            name="woman-sharp"
            size={Layout.iconSize.m}
            color={theme.white} // Cor do ícone na legenda
            style={{
              backgroundColor: theme.tint,
              borderRadius: Layout.iconSize.m,
              padding: 2
            }} // Estilo similar ao do mapa
          />
          <Text style={styles.legendText}>Você</Text>
        </View>
        <View style={styles.legendItem}>
          <Icon
            name="shield-checkmark-sharp"
            size={Layout.iconSize.m}
            color={theme.success}
          />
          <Text style={styles.legendText}>Ponto Seguro</Text>
        </View>
        <View style={styles.legendItem}>
          <Icon
            name="warning-sharp"
            size={Layout.iconSize.m}
            color={theme.danger}
          />
          <Text style={styles.legendText}>Área de Risco</Text>
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

// Copie e cole os estilos da sua versão anterior de map.js, incluindo aggressorMarkerContainer, etc.
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.background },
  map: { flex: 1 },
  aggressorMarkerContainer: { padding: 2 },
  normalAggressorIcon: {
    /* Estilo padrão */
  },
  alertAggressorIcon: {
    backgroundColor: theme.danger,
    borderRadius: (Layout.iconSize.l + 6 + 4) / 2,
    padding: 2
  },
  calloutContainer: { width: 230 },
  calloutView: {
    width: 210,
    padding: Layout.spacing.s,
    backgroundColor: theme.cardBackground,
    borderRadius: Layout.borderRadius.m,
    borderColor: theme.borderColor,
    borderWidth: 1
  },
  calloutTitle: {
    ...Typography.body2,
    fontFamily: Typography.fontFamilyBold,
    color: theme.text,
    marginBottom: Layout.spacing.xs
  },
  calloutDescription: { ...Typography.caption, color: theme.mediumGrey },
  legendContainer: {
    position: "absolute",
    bottom: Layout.spacing.m,
    left: Layout.spacing.m,
    right: Layout.spacing.m,
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingVertical: Layout.spacing.s,
    paddingHorizontal: Layout.spacing.m,
    borderRadius: Layout.borderRadius.m,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    elevation: 5,
    shadowColor: theme.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: Layout.borderRadius.s
  },
  legendItem: { flexDirection: "row", alignItems: "center" },
  legendText: {
    ...Typography.caption,
    color: theme.text,
    marginLeft: Layout.spacing.xs,
    fontSize: 10
  }
});
