import { useEffect, useState } from "react";
import { getListTodos } from "../service/api";
import type { Post } from "../types/post";
import Carousel from "../components/Carousel/Carousel";
import PostList from "../components/PostList/PostList";

function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const result = await getListTodos();
        setPosts(result);
      } catch (err) {
        console.error("Erro ao carregar posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="page-container"><p>Carregando posts...</p></div>;
  }

  return (
    <div className="page-container">
      <Carousel posts={posts} />
      <PostList posts={posts} />
    </div>
  );
}

export default Home;
