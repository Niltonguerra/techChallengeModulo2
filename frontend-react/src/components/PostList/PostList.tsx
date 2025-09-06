import { useState } from "react";
import type { Post } from "../../types/post";
import PostCard from "../PostCard/PostCard";
import "./PostList.scss";
import Pagination from "../Pagination/Pagination"; // ajuste o caminho se necessário

interface PostListProps {
  posts: Post[];
}

export default function PostList({ posts }: PostListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 8; // ou qualquer valor que você queira

  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);

  // calcular os posts da página atual
  const currentPosts = sortedPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  return (
    <div className="post-list-wrapper">
      <h2>Postagens</h2>
      <div className="post-list">
        {currentPosts.map((post) => (
          <PostCard key={post.id} post={post} />
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
