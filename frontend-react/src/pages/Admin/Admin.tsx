// Admin.tsx
import { useEffect, useState } from "react";
import PostList from "../../components/PostList/PostList";
import { getListTodos } from "../../service/post";
import { usePosts } from "../../store/post";
import { Button } from "@mui/material";

function Admin() {
  const {setPosts} = usePosts();
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
      <PostList isAdmin />
    </div>
  );
}

export default Admin;
