import React, { useEffect } from "react";
import { Stack, usePathname, useRootNavigationState, useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { MD3LightTheme, PaperProvider } from "react-native-paper";
import { ConfirmModalProvider } from "@/hooks/modalConfirm/ConfirmModal";
import { SnackbarProvider } from "@/hooks/snackbar/snackbar";

export default function AppContent() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const pathname = usePathname();
  const nav = useRootNavigationState();

  useEffect(() => {
    if (!nav?.key) return;

    const currentRoute = pathname;
    const allowedRoutes = ["/PostDetail","/edit-user-data"];
    const isAdmin = user?.permission === "admin" || user?.role === "admin";
    const isAdminRoute =
      currentRoute.startsWith("/admin-") ||
      currentRoute.startsWith("/(admin)") ||
      currentRoute.includes("/post") ||
      currentRoute.includes("/user");

    const isTabsRoute = currentRoute.startsWith("/(tabs)");
    const isAuthRoute =
      currentRoute.includes("login") ||
      currentRoute.includes("user-registration") ||
      currentRoute.includes("faq");

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

    if (currentRoute.startsWith("/(auth)")) {
      router.replace("/(tabs)");
      return;
    }

    const isAllowed =
      isTabsRoute || isAdminRoute || allowedRoutes.includes(currentRoute);

    if (!isAllowed) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, pathname, user, router]);

  const theme = {
    ...MD3LightTheme,
  };

  return (
    <PaperProvider theme={theme}>
      <ConfirmModalProvider>
        <SnackbarProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </SnackbarProvider>
      </ConfirmModalProvider>
    </PaperProvider>
  );
}
