import { useState } from "react";
import type { Post } from "../../types/post";
import PostCard from "../PostCard/PostCard";
import "./PostList.scss";
import Pagination from "../Pagination/Pagination"; // ajuste o caminho se necessário

interface PostListProps {
  posts: Post[];
  isAdmin?: boolean; // 🔹 NOVO
}

export default function PostList({ posts, isAdmin = false }: PostListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 8;

  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
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
      {isAdmin && (<button className="create-btn">Criar nova postagem</button>)}
      </div>
      <div className="post-list">
        {currentPosts.map((post) => (
          <PostCard key={post.id} post={post} isAdmin={isAdmin} />
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