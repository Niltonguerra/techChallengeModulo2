import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import PostForm from "@/components/PostForm/form";

export default function AdminPostFormPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const editId = typeof params.edit === "string" ? params.edit : undefined;

  const handleAfterSubmit = () => {
    router.push("/(admin)/admin-post");
  };

  return (
    <View style={styles.container}>
      <PostForm postId={editId} afterSubmit={handleAfterSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
});
