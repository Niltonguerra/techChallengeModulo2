import { useState } from "react";
import type { Post } from "../../types/post";
import "./PostCard.scss";
import { deletePost, /*updatePost*/ } from "../../service/api";

interface PostCardProps {
  post: Post;
  isAdmin?: boolean;
}

export default function PostCard({ post, isAdmin = false }: PostCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const visibleCategories = post.content_hashtags.slice(0, 3);
  const hiddenCategories = post.content_hashtags.slice(3);

  return (
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
          <a href={`/post/${post.id}`} className="post-btn">
            Ver mais
          </a>

          {isAdmin && (
            <div className="admin-actions">
              <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                ☰
              </button>
              {menuOpen && (
                <ul className="menu">
                  <li onClick={() => console.log("editar", post.id)}>Editar</li>
                  <li onClick={() => deletePost(post.id)}>Excluir</li>
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
