import React, { useState, useCallback } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { UserModal } from "@/components/UserModal";
import styleGuide from "@/constants/styleGuide";

export default function TabTwoScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setModalVisible(true);
    }, [])
  );

  const handleCloseModal = () => {
    setModalVisible(false);

    router.navigate("/");
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator
        size="large"
        color={styleGuide.palette.main.primaryColor}
      />

      <UserModal visible={modalVisible} onClose={handleCloseModal} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
