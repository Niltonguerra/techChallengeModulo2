import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Post } from "../../types/post";
import PostCard from "../PostCard/PostCard";
import "./PostList.scss";
import Pagination from "../Pagination/Pagination"; // ajuste o caminho se necessário
import { usePosts } from "../../pages/store/post";

interface PostListProps {
  posts: Post[];
  isAdmin?: boolean; // 🔹 NOVO
}

export default function PostList({ isAdmin = false }: PostListProps) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  // const [localPosts, setLocalPosts] = useState<Post[]>(posts);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { posts, setPosts } = usePosts();
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