import React, { useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs, useSegments } from "expo-router";
import { useSelector } from "react-redux";
import { View, Image, StyleSheet, Platform, Text } from "react-native";
import styleGuide from "@/constants/styleGuide";
import { RootState } from "@/store/store";
import Header from "@/components/header/header";
import { UserModal } from "@/components/userModal/UserModal";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

function UserTabIcon({ photo }: { photo?: string }) {
  if (photo) {
    return <Image source={{ uri: photo }} style={styles.tabPhoto} />;
  }
  return (
    <TabBarIcon
      name="user-circle"
      color={styleGuide.palette.main.secondColor}
    />
  );
}

function extractActiveScreen(segments: string[]): string {
  for (let i = segments.length - 1; i >= 0; i--) {
    const s = segments[i];
    if (!s) continue;
    if (s.startsWith("(")) continue;
    return s;
  }
  return "index";
}

export default function TabLayout() {
  const user = useSelector((state: RootState) => state.auth.user);

  const [modalVisible, setModalVisible] = useState(false);

  const segments = useSegments();
  const currentScreen = extractActiveScreen(segments);
  const isInitial = currentScreen === "index";

  const tabLabel = user?.name
    ? user.name.length > 14
      ? user.name.slice(0, 14) + "…"
      : user.name
    : "Opções";

  const activeTintColor = styleGuide.palette.main.secondColor;
  const inactiveTintColor = styleGuide.palette.main.textSecondaryColor;

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={({ route }) => {
          const headerTitle = route.name === "index" ? "Início" : "Educafácil";
          return {
            tabBarActiveTintColor: activeTintColor,
            tabBarInactiveTintColor: inactiveTintColor,
            tabBarStyle: {
              backgroundColor: "#fff",
              borderTopColor: "#ddd",
              paddingBottom: Platform.OS === "android" ? 8 : 12,
              height: Platform.OS === "android" ? 72 : 92,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              marginBottom: Platform.OS === "android" ? 4 : 6,
            },
            header: () => <Header title={headerTitle} showBack={!isInitial} />,
          };
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Início",
            tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          }}
        />

        <Tabs.Screen
          name="two"
          options={{
            tabBarLabel: ({ color }) => (
              <Text style={[styles.tabLabel, { color }]}>{tabLabel}</Text>
            ),
            tabBarIcon: ({ color }) => <UserTabIcon photo={user?.photo} />,
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();

              setModalVisible(true);
            },
          }}
        />
      </Tabs>

      <UserModal visible={modalVisible} onClose={handleCloseModal} />
    </View>
  );
}

const styles = StyleSheet.create({
  tabPhoto: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: styleGuide.palette.main.secondColor,
  },
  tabLabel: {
    fontSize: 12,
    textAlign: "center",
    maxWidth: 110,
  },
});
