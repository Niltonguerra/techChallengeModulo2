import CardPost from "@/components/CardPost/CardPost";
import styleGuide from "@/constants/styleGuide";
import { Post } from "@/types/post";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextStyle, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { Filter } from "../../components/Filter";
import { fetchPosts } from "../../services/post";

export default function TabOneScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false); // loading para filtros
  const [loadingMore, setLoadingMore] = useState(false); // loading para paginação
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  useEffect(() => {
    handleFilter();
  }, []);

  type PostFilters = {
    search?: string;
    content?: string;
    createdAtAfter?: string;
    createdAtBefore?: string;
  };

  // Função para filtrar posts
  const handleFilter = async (filters: PostFilters = {}) => {
    setLoading(true);
    try {
      const data = await fetchPosts({
        ...filters,
        offset: "0",
        limit: limit.toString(),
        advanced: true,
      });
      setPosts(data || []);
      setOffset(data?.length || 0);
      setHasMore((data?.length || 0) === limit);
    } catch (err) {
      console.error("Erro ao buscar posts:", err);
    } finally {
      setLoading(false);
    }
  };

  // Função para carregar mais posts (infinite scroll)
  const fetchMorePosts = async () => {
    if (loading || loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const data = await fetchPosts({
        offset: offset.toString(),
        limit: limit.toString(),
        advanced: true,
      });
      if (data?.length) {
        setPosts([...posts, ...data]);
        setOffset(offset + data.length);
        setHasMore(data.length === limit);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: styleGuide.palette.main.fourthColor }}>
      <Filter onFilter={handleFilter} />

      <View style={{ flex: 1, marginTop: 16 }}>
        {posts.length === 0 && loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={styleGuide.palette.main.primaryColor} />
          </View>
        ) : posts.length === 0 ? (
          <View style={styles.centered}>
            <Text
              style={{
                textAlign: "center",
                marginTop: 24,
                ...(styleGuide.typography.h5 as TextStyle),
                fontSize: 16,
                marginBottom: 8,
              }}
            >
              Nenhum post encontrado.
            </Text>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <FlatList
              data={posts}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <CardPost isEditable={false} dataProperties={item} />}
              onEndReached={fetchMorePosts}
              onEndReachedThreshold={0.5}
              ListFooterComponent={
                loadingMore ? (
                  <ActivityIndicator style={{ margin: 16 }} color={styleGuide.palette.main.primaryColor} />
                ) : null
              }
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 32 }}
            />
            {loading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color={styleGuide.palette.main.primaryColor} />
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.5)",
  },
});
