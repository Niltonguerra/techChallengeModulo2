import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";
import CardPost from "@/components/CardPost/CardPost";
import { Post } from "@/types/post";
import { getListTodos } from "@/services/post";
import { useSnackbar } from "@/hooks/snackbar/snackbar";
import styleGuide from "@/constants/styleGuide";

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const { showSnackbar } = useSnackbar();
  const router = useRouter();

  const fetchPosts = async () => {
    try {
      const data = await getListTodos();
      setPosts(data);
    } catch (err: any) {
      console.error(err);
      showSnackbar({
        message: "Não foi possível carregar os posts.",
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);


  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CardPost dataProperties={item} isEditable />
        )}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      <View style={styles.buttonRow}>
        <Button
          mode="contained"
          onPress={() => router.push("/(tabs)")}
          style={{ ...styles.submitButton, ...styles.halfButton }}
          contentStyle={styles.submitContent}
        >
          Voltar
        </Button>
        <Button
          mode="contained"
          onPress={() => router.push({ pathname: "/(admin)/form-post" })}
          style={{ ...styles.submitButton, ...styles.halfButton }}
          contentStyle={styles.submitContent}
        >
          Criar Novo Post
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: styleGuide.light.background },
  submitButton: {
    marginTop: 24,
    marginBottom: 32,
    backgroundColor: styleGuide.palette.main.primaryColor,
  },
  submitContent: { paddingVertical: 8 },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 16,
  },
  halfButton: { flexBasis: "47%" },
});
