// app/_layout.tsx
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import React, { useEffect } from "react";
import { PaperProvider } from "react-native-paper";
import "react-native-reanimated";
import { Provider } from "react-redux";
import { ConfirmModalProvider } from "@/hooks/modalConfirm/ConfirmModal";
import { SnackbarProvider } from "@/hooks/snackbar/snackbar";
import { store } from "@/store/store";

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
      <PaperProvider>
        <ConfirmModalProvider>
          <SnackbarProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </SnackbarProvider>
        </ConfirmModalProvider>
      </PaperProvider>
    </Provider>
  );
}
