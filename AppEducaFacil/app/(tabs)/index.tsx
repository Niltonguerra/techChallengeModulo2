import { Post } from '@/types/post';
import React, { useEffect, useState } from "react";
import { FlatList, View } from 'react-native';
import { ActivityIndicator, Text } from "react-native-paper";
import CardPost from "../../components/CardPost";
import { Filter } from "../../components/Filter";
import { fetchPosts } from "../../services/post";

export default function TabOneScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  // Carrega listagem inicial
  useEffect(() => {
    handleFilter();
  }, []);

  type PostFilters = {
    search?: string;
    content?: string;
    createdAtAfter?: string;
    createdAtBefore?: string;
  };
  // Função para buscar posts (com opção de mostrar loader)
  const handleFilter = async (filters: PostFilters = {}, showLoader: boolean = true) => {
    if (showLoader) setLoading(true);
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
      if (showLoader) setLoading(false);
    }
  };

  // Função para carregar mais posts (infinite scroll)
  const fetchMorePosts = async () => {
    if (loading || !hasMore) return;

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
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>

      <Filter onFilter={handleFilter} />

      {/* Área de posts */}
      <View style={{ flex: 1, marginTop: 16 }}>
        {loading ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" />
          </View>
        ) : posts.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 24 }}>Nenhum post encontrado.</Text>
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <CardPost post={item} />}
            onEndReached={fetchMorePosts}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              hasMore ? <ActivityIndicator style={{ margin: 16 }} /> : null
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}
