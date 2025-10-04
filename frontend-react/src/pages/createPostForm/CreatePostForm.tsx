
import { useEffect, useState } from "react";
import FormPost from "../../components/FormPost/FormPost";
import { getListById } from "../../service/post";
import { useParams } from 'react-router-dom';
import type { FormPostData } from "../../types/form-post";
import type { ResultApi } from "../../types/post";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { initialFormPostState } from "../../constants/formConstants";

export function CreateEditPostFormPage() {
  const [postData, setPostData] = useState<FormPostData>();
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const postId = params.id;
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!postId) {
          setPostData({
            ...initialFormPostState,
            author_id: user!.id,
          });
          setLoading(false);
          return;
        }
        const result: ResultApi = await getListById(postId!);
        if (result && result.ListPost && result.ListPost.length > 0) {
          const post = result.ListPost[0];
          const external_link: Record<string, string> = {};
          if (post.external_link) {
            for (const [key, value] of Object.entries(post.external_link)) {
              if (typeof value === 'string') external_link[key] = value;
            }
          }
          setPostData({
            author_id: user!.id,
            content_hashtags: post.content_hashtags,
            description: post.description,
            id: post.id,
            image: post.image,
            introduction: post.introduction,
            title: post.title,
            external_link 
          });
          setLoading(false);
        }
      } catch {
        console.error("Erro ao buscar o post.");
      }
    };
    fetchPost();
  }, []);

  return (
    <>
      {loading ? (
        <div>Carregando...</div>
      ) : (
        <FormPost {...postData} />
      )}
    </>
  );
}
