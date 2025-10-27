import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import PostForm from "@/components/PostForm/form";

export default function AdminPostFormPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  // garantir tipo compatível com PostForm (string | undefined)
  const editId = typeof params.edit === "string" ? params.edit : undefined;

  const handleAfterSubmit = () => {
    // volta para a lista de posts após criar/editar
    router.replace("/(admin)/post");
  };

  return (
    <View style={styles.container}>
      <Button mode="text" onPress={() => router.back()} style={{ marginBottom: 8 }}>
        Voltar
      </Button>

      <Text variant="titleLarge" style={{ marginBottom: 12 }}>
        {editId ? "Editar Post" : "Criar Post"}
      </Text>

      <PostForm postId={editId} afterSubmit={handleAfterSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
});