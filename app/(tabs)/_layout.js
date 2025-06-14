import React, { useEffect, useState } from "react";
import { Tabs, useNavigation, useRouter } from "expo-router";
import { View, Text, Platform, AppState } from "react-native";
import Icon from "../../components/Icon";
import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import Typography from "../../constants/Typography";
import { useEmergency } from "../../contexts/EmergencyContext";

const theme = Colors.light;

export default function TabLayout() {
  const navigation = useNavigation(); // Hook para acessar o navigator e setOptions
  const router = useRouter();
  const { proximityAlert, isEmergencyActive } = useEmergency();
  const [appHeaderTitle, setAppHeaderTitle] = useState(null); // Para título dinâmico

  useEffect(() => {
    let headerOptions = {
      headerStyle: {
        backgroundColor: theme.background,
        borderBottomColor: theme.borderColor
      },
      headerTintColor: theme.text,
      headerTitle: appHeaderTitle // Usa o título da rota ou o dinâmico
    };

    if (
      proximityAlert.isActive &&
      proximityAlert.aggressor &&
      !isEmergencyActive
    ) {
      // Só muda header se não estiver em emergência principal
      headerOptions = {
        ...headerOptions,
        headerStyle: { backgroundColor: theme.danger },
        headerTintColor: theme.white,
        headerTitle: () => (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon
              name="warning-sharp"
              size={Layout.iconSize.m}
              color={theme.white}
              style={{ marginRight: Layout.spacing.s }}
            />
            <Text
              style={{
                color: theme.white,
                fontSize: Typography.h4.fontSize,
                fontFamily: Typography.fontFamilyBold
              }}
            >
              PERIGO PRÓXIMO!
            </Text>
          </View>
        )
      };
    }
    // Atualiza as opções do header do navigator PAI (que é o Tabs navigator aqui)
    navigation.getParent()?.setOptions(headerOptions);
  }, [proximityAlert, navigation, theme, appHeaderTitle, isEmergencyActive]);

  return (
    <Tabs
      screenListeners={{
        state: (e) => {
          // Pega o nome da rota atual para definir o título do header
          const routeName = e.data.state?.routes[e.data.state.index]?.name;
          let title = "";
          if (routeName === "home") title = "Início";
          else if (routeName === "map") title = "Mapa de Segurança";
          else if (routeName === "support") title = "Rede de Apoio";
          else if (routeName === "settings") title = "Ajustes";
          setAppHeaderTitle(title); // Atualiza o título para o useEffect acima usar
        }
      }}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          const size = focused ? Layout.iconSize.l - 4 : Layout.iconSize.m;
          if (route.name === "home")
            iconName = focused ? "home" : "home-outline";
          else if (route.name === "map")
            iconName = focused ? "map" : "map-outline";
          else if (route.name === "support")
            iconName = focused ? "people-circle" : "people-circle-outline";
          else if (route.name === "settings")
            iconName = focused ? "settings" : "settings-outline";
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.tint,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.borderColor,
          height: 85,
          paddingBottom:
            Platform.OS === "ios" ? Layout.spacing.l : Layout.spacing.m,
          paddingTop: Layout.spacing.s
        },
        tabBarLabelStyle: {
          fontFamily: Typography.fontFamilyRegular,
          fontSize: 11,
          fontWeight: "500"
        },
        headerShown: false,
        headerTitleAlign: "center"
      })}
    >
      <Tabs.Screen name="home" options={{ title: "Início" }} />
      <Tabs.Screen name="map" options={{ title: "Mapa de Segurança" }} />
      <Tabs.Screen name="support" options={{ title: "Rede de Apoio" }} />
      <Tabs.Screen name="settings" options={{ title: "Ajustes" }} />
    </Tabs>
  );
}
