import { useEffect, useState } from "react";
import Carrosel from "../../components/Carousel/Carousel";
import PostList from "../../components/PostList/PostList";
import SearchPost from "../../components/searchPost/SearchPost";
import { getListTodos } from "../../service/post";
import { usePosts } from "../../store/post";

function Home() {
  const { setPosts } = usePosts();

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
  }, [setPosts]);

  if (loading) {
    return <div className="page-container"><p>Carregando posts...</p></div>;
  }
  return (
    <div className="page-container">
      <Carrosel />
      <SearchPost />
      <PostList />
    </div>
  );
}

export default Home;