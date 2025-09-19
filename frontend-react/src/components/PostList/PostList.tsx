import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PostCard from "../PostCard/PostCard";
import "./PostList.scss";
import Pagination from "../Pagination/Pagination"; // ajuste o caminho se necessário
import { usePosts } from "../../store/post";
import { Button } from "@mui/material";

interface PostListProps {
  isAdmin?: boolean; // 🔹 NOVO
}

export default function PostList({ isAdmin = false }: PostListProps) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  // const [localPosts, setLocalPosts] = useState<Post[]>(posts);
   
  const { posts } = usePosts();
  const postsPerPage = 8;

  const sortedPosts = [...posts].sort((a, b) =>
  a.title.localeCompare(b.title, "pt-BR", { sensitivity: "base" })
);

  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);
  const currentPosts = sortedPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  

  return (
    <div className="post-list-wrapper">
        {isAdmin && (
        <div className="back-actions">
          <Button type="button" onClick={() => navigate("/")} style={{ marginBottom: 16 }} variant="outlined">Voltar</Button>
        </div>
        )}
      <div className="post-list-header">
        <h2>Postagens</h2>
      {isAdmin && (  
          <Button className="create-btn" onClick={() => navigate("/admin/post/create")}>Criar nova postagem</Button>
        )}
      </div>
      <div className="post-list">
        {currentPosts.map((post) => (
          <PostCard key={post.id} post={post} isAdmin={isAdmin}/>
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}