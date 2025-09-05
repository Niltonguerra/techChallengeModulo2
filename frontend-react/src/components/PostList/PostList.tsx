import type { Post } from "../../types/post";
import PostCard from "../PostCard/PostCard";
import "./PostList.scss";

interface PostListProps {
  posts: Post[];
}

export default function PostList({ posts }: PostListProps) {
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  return (
    <div className="post-list-wrapper">
      <div className="post-list">
        {sortedPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
