import CardPost from "../../components/CardPost/CardPost";
import styleGuide from "@/constants/styleGuide";
import { Post } from "@/types/post";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextStyle, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { Filter } from "../../components/filter/Filter";
import { fetchPosts } from "../../services/post";

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false); // loading inicial/filtros
  const [loadingMore, setLoadingMore] = useState(false); // loading paginação
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
        setPosts((prev) => [...prev, ...data]);
        setOffset((prev) => prev + data.length);
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
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const isCloseToBottom =
            layoutMeasurement.height + contentOffset.y >= contentSize.height - 200;
          if (isCloseToBottom) fetchMorePosts();
        }}
      >
        <Filter onFilter={handleFilter} />
        <View style={{ marginTop: 16 }}>
          {posts.length === 0 && !loading ? (
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
            posts.map((item) => (
              <CardPost key={item.id} isEditable={false} dataProperties={item} />
            ))
          )}

          {loadingMore && (
            <ActivityIndicator
              style={{ marginVertical: 16 }}
              color={styleGuide.palette.main.primaryColor}
            />
          )}
        </View>
      </ScrollView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={styleGuide.palette.main.primaryColor} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: styleGuide.palette.main.fourthColor,
  },
  scrollContent: {
    paddingVertical: 16,
    paddingBottom: 40,
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.5)",
  },
});
