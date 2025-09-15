// import { useEffect, useState } from "react";
// import type { ResultApi } from "../../types/post";
// import { getListById } from "../../service/api";
// import { useParams } from 'react-router-dom';
// import CreateUserForm from "../../components/FormUser/FormUser";

// export function CreateEditFormPage() {
//     const [posts, setPosts] = useState<ResultApi | null>(null);
//     const [loading, setLoading] = useState(true);
//     const params = useParams();
//     const postId: string|boolean = params.id ?? false;

//     useEffect(() => {
//       const fetchPosts = async () => {
//         try {
//           if (postId) {
//             const result = await getListById(postId);
//             setPosts(result);
//           }else{
//             setPosts(null);
//           }
//         } catch (err) {
//           console.error("Erro ao carregar posts:", err);
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchPosts();
//     }, []);

    
//   return (
//     <>
//       {loading ? (
//         <>
//           <div>Carregando...</div>
//         </>
//       ) : (
//         <CreateUserForm
//           {...{
//             ...posts?.ListPost[0]
//           }}
//         />
//       )}
//     </>
//   );
// }
