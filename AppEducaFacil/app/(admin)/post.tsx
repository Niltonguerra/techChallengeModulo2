import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Alert } from "react-native";
import { Button, Text } from "react-native-paper";
import { useRouter } from "expo-router";

import CardPost from "@/components/CardPost/CardPost";
import { Post } from "@/types/post";
import { useDeletePost } from "@/hooks/handleDeletePost/handleDeletePost";
import { getListTodos } from "@/services/post"; 

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const { handleDeletePost } = useDeletePost();
  const router = useRouter();

  const fetchPosts = async () => {
    try {
      const data = await getListTodos(); 
      setPosts(data);
    } catch (err: any) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível carregar os posts.");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Função para deletar e atualizar a lista localmente
  const onDelete = async (id: string) => {
    try {
      await handleDeletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível deletar o post.");
    }
  };

  return (
    <View style={styles.container}>
      <Button mode="text" onPress={() => router.back()} style={{ marginBottom: 8 }}>
        Voltar
      </Button>

      <Text style={styles.title}>Gerenciar Postagens</Text>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CardPost
            dataProperties={item}
            isEditable
          />
        )}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      <Button
        mode="contained"
        onPress={() => router.push({ pathname: "/(admin)/post/form" })}
        style={styles.addButton}
      >
        + Criar Novo Post
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  addButton: { marginTop: 10 },
});
