import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, SplashScreen, useRouter, usePathname } from "expo-router";
import React, { useEffect } from "react";
import "react-native-reanimated";
import { Provider, useSelector } from "react-redux";
import { PaperProvider } from "react-native-paper";

import { useColorScheme } from "@/components/useColorScheme";
import { ConfirmModalProvider } from "@/hooks/modalConfirm/ConfirmModal";
import { SnackbarProvider } from "@/hooks/snackbar/snackbar";
import { store, RootState } from "@/store/store";
import Header from "@/components/header/header";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

function AppContent() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const pathname = usePathname();

  // Pegando isAuthenticated e user do Redux
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (!isAuthenticated) {
      if (!pathname?.startsWith("/(auth)")) {
        router.replace("/(auth)/login");
      }
      return;
    }

    // determina se é admin (suporta permission ou role)
    const isAdmin = user?.permission === "admin" || user?.role === "admin";

    // bloqueia acesso a rotas /admin para usuários não-admin
    if (pathname?.startsWith("/(admin)") && !isAdmin) {
      router.replace("/(tabs)");
      return;
    }

    // se autenticado e ainda está nas rotas de auth, direciona para tabs
    if (pathname?.startsWith("/(auth)")) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, pathname, user, router]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <PaperProvider>
        <ConfirmModalProvider>
          <SnackbarProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="modal" options={{ presentation: "modal" }} />
            </Stack>
          </SnackbarProvider>
        </ConfirmModalProvider>
      </PaperProvider>
    </ThemeProvider>
  );
}