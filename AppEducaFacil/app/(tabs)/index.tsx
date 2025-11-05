import CardPost from "../../components/CardPost/CardPost";
import styleGuide from "@/constants/styleGuide";
import { Post } from "@/types/post";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Filter } from "../../components/filter/Filter";
import { fetchPosts } from "../../services/post";
import CarouselPosts from "@/components/Carousel/Carousel";

export default function TabOneScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;
  const screenWidth = Dimensions.get("window").width;

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
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: styleGuide.palette.main.fourthColor,
      }}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
      onScrollEndDrag={() => fetchMorePosts()}
    >
      {/* 🔹 Carrossel sem bordas */}
      {posts.length > 0 && (
        <View style={{ width: screenWidth, marginBottom: 16 }}>
          <CarouselPosts posts={posts} />
        </View>
      )}

      {/* 🔹 Filtro com padding lateral */}
      <View style={{ paddingHorizontal: 16 }}>
        <Filter onFilter={handleFilter} />
      </View>

      {/* 🔹 Conteúdo */}
      <View style={{ paddingHorizontal: 16 }}>
        {loading && posts.length === 0 ? (
          <View style={styles.centered}>
            <ActivityIndicator
              size="large"
              color={styleGuide.palette.main.primaryColor}
            />
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
          <>
            {posts.map((item) => (
              <CardPost key={item.id} isEditable={false} dataProperties={item} />
            ))}
            {loadingMore && (
              <ActivityIndicator
                style={{ marginTop: 16 }}
                color={styleGuide.palette.main.primaryColor}
              />
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});
