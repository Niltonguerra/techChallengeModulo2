import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, usePathname, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { PaperProvider } from "react-native-paper";
import "react-native-reanimated";
import { Provider, useSelector } from "react-redux";
import { ConfirmModalProvider } from "@/hooks/modalConfirm/ConfirmModal";
import { SnackbarProvider } from "@/hooks/snackbar/snackbar";
import { RootState, store } from "@/store/store";
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
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

function AppContent() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const currentRoute = pathname;

    // Rotas que NÃO devem ser redirecionadas automaticamente
    const allowedRoutes = ["/PostDetail"];

    if (isAuthenticated) {
      if (
        !currentRoute.startsWith("/(tabs)") &&
        !allowedRoutes.includes(currentRoute)
      ) {
        router.replace("/(tabs)");
      }
    } else {
      if (!currentRoute.startsWith("/(auth)/login")) {
        router.replace("/(auth)/login");
      }
    }
  }, [isAuthenticated, pathname, router]);

  return (
    <PaperProvider>
      <ConfirmModalProvider>
        <SnackbarProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </SnackbarProvider>
      </ConfirmModalProvider>
    </PaperProvider>
  );
}
