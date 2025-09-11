import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Post } from "../../types/post";
import PostCard from "../PostCard/PostCard";
import "./PostList.scss";
import Pagination from "../Pagination/Pagination"; // ajuste o caminho se necessário

interface PostListProps {
  posts: Post[];
  isAdmin?: boolean; // 🔹 NOVO
}

export default function PostList({ posts, isAdmin = false }: PostListProps) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [localPosts, setLocalPosts] = useState<Post[]>(posts);
  const postsPerPage = 8;

   useEffect(() => {
    setLocalPosts(posts); // 🔹 atualiza caso posts vindo do pai mudem
  }, [posts]);

  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setLocalPosts(prev => prev.filter(p => p.id !== customEvent.detail));
    };

    window.addEventListener("postDeleted", handler);
    return () => window.removeEventListener("postDeleted", handler);
  }, []);

  const sortedPosts = [...localPosts].sort((a, b) =>
  a.title.localeCompare(b.title, "pt-BR", { sensitivity: "base" })
);

  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);
  const currentPosts = sortedPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  

  return (
    <div className="post-list-wrapper">
      <h2>Postagens</h2>
      <div className="post-list-header">
        {isAdmin && (<button className="create-btn" onClick={() => navigate("/admin/post/create")}>Criar nova postagem</button>)}
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