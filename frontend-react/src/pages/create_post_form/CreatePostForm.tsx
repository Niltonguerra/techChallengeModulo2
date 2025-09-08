import { useEffect, useState } from "react";
import FormPost from "../../components/FormPost/FormPost";
import type { ResutApi } from "../../types/post";
import { getListById } from "../../service/api";
import { useParams } from 'react-router-dom';

export function CreateEditFormPage() {
    const [posts, setPosts] = useState<ResutApi | null>(null);
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const postId: string|boolean = params.id ?? false;

    useEffect(() => {
      const fetchPosts = async () => {
        try {
          if (postId) {
            const result = await getListById(postId);
            setPosts(result);
          }else{
            setPosts(null);
          }
        } catch (err) {
          console.error("Erro ao carregar posts:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchPosts();
    }, []);

    
  return (
    <>
      {loading ? (
        <>
          <div>Carregando...</div>
        </>
      ) : (
        <FormPost
          {...{
            ...posts?.ListPost[0]
          }}
        />
      )}
    </>
  );
}
