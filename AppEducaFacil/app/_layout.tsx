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
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const currentRoute = pathname;

    if (isAuthenticated) {
      if (!currentRoute.startsWith("/(tabs)")) {
        console.log("Redirecting to (tabs)");
        router.replace("/(tabs)");
      }
    } else {
      if (!currentRoute.startsWith("/(auth)")) {
        console.log("Redirecting to (auth)/login");
        router.replace("/(auth)/login");
      }
    }
  }, [isAuthenticated, pathname, router]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <PaperProvider>
        <ConfirmModalProvider>
          <SnackbarProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(auth)" />

              <Stack.Screen name="(tabs)" />

              <Stack.Screen name="modal" options={{ presentation: "modal" }} />
            </Stack>
          </SnackbarProvider>
        </ConfirmModalProvider>
      </PaperProvider>
    </ThemeProvider>
  );
}
