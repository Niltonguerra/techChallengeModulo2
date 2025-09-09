import { useState } from "react";
import type { Post } from "../../types/post";
import PostModal from "../PostModal/PostModal";
import "./PostCard.scss";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const visibleCategories = post.content_hashtags.slice(0, 3);
  const hiddenCategories = post.content_hashtags.slice(3);
  const [open, setOpen] = useState(false);

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

            </button>
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
