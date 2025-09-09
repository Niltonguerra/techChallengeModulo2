import { useEffect, useState } from "react";
import Carousel from "../components/Carousel/Carousel";
import PostList from "../components/PostList/PostList";
import { getListTodos } from "../service/api";
import type { Post } from "../types/post";

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

  // 🔹 Carousel -> 5 mais recentes
  const carouselPosts = [...posts]
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )
    .slice(0, 5);

  // 🔹 Lista -> ordem alfabética pelo título
  const listPosts = [...posts].sort((a, b) =>
    a.title.localeCompare(b.title, "pt-BR")
  );


  return (
    <div className="page-container">
      <Carousel posts={carouselPosts} />
      <PostList posts={listPosts} />
    </div>
  );
}

export default Home;
