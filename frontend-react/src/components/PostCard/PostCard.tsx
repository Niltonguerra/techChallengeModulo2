import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deletePost, /*updatePost*/ } from "../../service/api";
import type { Post } from "../../types/post";
import PostModal from "../PostModal/PostModal";
import "./PostCard.scss";
import { usePosts } from "../../store/post";

interface PostCardProps {
  post: Post;
  isAdmin?: boolean;
}


export default function PostCard({ post, isAdmin = false }: PostCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const visibleCategories = post.content_hashtags.slice(0, 3);
  const hiddenCategories = post.content_hashtags.slice(3);
  const [open, setOpen] = useState(false);

  const { posts, setPosts } = usePosts();

  const handleDeletePost = async (postId: string) => {
    try {
      await deletePost(postId)
        .then(() => {
          // then remove it from the list
          setPosts(posts.filter((p) => p.id !== postId));
        });
    } catch (error) {
      console.error("Erro ao deletar post:", error);
    }
  }

  return (
    <>
      <div className="post-card">
        <img src={post.image} alt={post.title} className="post-image" />
        <div className="post-content">
          <div className="post-content-main">
            <h3>{post.title}</h3>

            <div className="post-categories">
              {visibleCategories.map((cat, idx) => (
                <span key={idx} className="category">{cat}</span>
              ))}
              {hiddenCategories.length > 0 && (
                <span
                  className="category more"
                  title={hiddenCategories.join(", ")}
                >
                  ...
                </span>
              )}
            </div>

            <p className="post-description">{post.description}</p>
          </div>

          <div className="post-content-footer">
            <p className="post-author">Por: {post.user_name}</p>
            <p className="post-date">
              Atualizado em {new Date(post.updated_at).toLocaleDateString()}
            </p>
            <button
              className="post-btn"
              onClick={() => setOpen(true)}
            >
              Ver mais
            </button>

            {isAdmin && (
              <div className="admin-actions">
                <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                  ☰
                </button>
                {menuOpen && (
                  <ul className="menu">
                    <li onClick={() => navigate(`/admin/post/edit/${post.id}`)}>Editar</li>
                    <li
                      onClick={async () => {
                        if (confirm("Tem certeza que deseja excluir esta postagem?")) {
                          try {
                            handleDeletePost(post.id);
                          } catch (err) {
                            console.error("Erro ao excluir:", err);
                            alert("Erro ao excluir postagem");
                          }
                        }
                      }}
                    >
                      Excluir
                    </li>
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <PostModal
        open={open}
        onClose={() => setOpen(false)}
        initialValues={post}
      />
    </>
  );
}
