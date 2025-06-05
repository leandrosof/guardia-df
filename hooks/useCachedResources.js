// hooks/useCachedResources.js
import { useEffect, useState } from "react";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons"; // Carrega a fonte Ionicons

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        // Carregar fontes
        await Font.loadAsync({
          ...Ionicons.font // Essencial para os ícones da TabNavigator
          // 'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
          // 'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
          // 'Inter-Medium': require('../assets/fonts/Inter-Medium.ttf'),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setLoadingComplete(true);
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
