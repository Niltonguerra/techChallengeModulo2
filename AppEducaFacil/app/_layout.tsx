import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, usePathname, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { PaperProvider } from "react-native-paper";
import "react-native-reanimated";
import { Provider, useSelector } from "react-redux";
import { ConfirmModalProvider } from "@/hooks/modalConfirm/ConfirmModal";
import { SnackbarProvider } from "@/hooks/snackbar/snackbar";
import { store, RootState } from "@/store/store";

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
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const currentRoute = pathname;
    const allowedRoutes = ["/PostDetail"];
    const isAdmin = user?.permission === "admin" || user?.role === "admin";
    const isAdminRoute =
      pathname.startsWith("/admin-") ||
      pathname.startsWith("/(admin)") ||
      pathname.includes("/post") ||
      pathname.includes("/user");

    const isTabsRoute = pathname.startsWith("/(tabs)");
    const isAuthRoute =
      pathname.includes("login") || pathname.includes("user-registration");

    if (!isAuthenticated) {
      if (!isAuthRoute) {
        router.replace("/login");
      }
      return;
    }

    if (isAdminRoute && !isAdmin) {
      router.replace("/(tabs)");
      return;
    }

    if (isAdminRoute && isAdmin) {
      return;
    }

    if (pathname.startsWith("/(auth)")) {
      router.replace("/(tabs)");
      return;
    }

    const isAllowed =
      isTabsRoute || isAdminRoute || allowedRoutes.includes(currentRoute);

    if (!isAllowed) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, pathname, user, router]);

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
