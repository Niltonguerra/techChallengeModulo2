import { formPostSchema } from '../schemas/form-post.schema';
import type { FormPostData, LinkItem } from '../types/form-post';
import { imgbbUmaImagem } from '../service/imgbb';
import { createPost, updatePost } from '../service/post';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

interface UseFormPostSubmitParams {
  form: FormPostData;
  links: LinkItem[];
  setErrors: (errors: Record<string, string>) => void;
}

export function useFormPostSubmit({ form, links, setErrors }: UseFormPostSubmitParams) {
  const navigate = useNavigate();
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const external_link = links.reduce((acc, { key, value }) => {
      if (key && value) acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    let dataParaEnvio: FormPostData = {
      content_hashtags: form.content_hashtags,
      description: form.description,
      image: form.image,
      id: form.id,
      introduction: form.introduction,
      title: form.title,
      external_link,
      author_id: form.author_id,
    };

    const result = formPostSchema.safeParse(dataParaEnvio);
    const newErrors: Record<string, string> = {};
    if (!result.success) {
      for (const err of result.error.issues) {
        if (err.path && err.path.length > 0) {
          newErrors[err.path[0] as string] = err.message;
        }
      }
    }

    if (
      form.image &&
      typeof form.image !== 'string' &&
      'type' in form.image &&
      form.image.type &&
      !form.image.type.startsWith('image/')
    ) {
      newErrors['image'] = 'O arquivo deve ser uma imagem válida';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    if (dataParaEnvio.image && typeof dataParaEnvio.image !== 'string') {
      try {
      const foto = await imgbbUmaImagem(dataParaEnvio.image as Blob);
      
      dataParaEnvio = {
        ...dataParaEnvio,
        image: foto ?? undefined,
      };
      }  catch {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "erro ao fazer upload da imagem!"
        });
        return;
      }
    }

    if (dataParaEnvio.id) {
      try {
      const returnData = await updatePost(dataParaEnvio);
      if (returnData.statusCode === 200) {
        Swal.fire({
          title: "sucesso!",
          icon: "success",
          text: "a postagem foi criada com sucesso!",
          draggable: true
        });
        navigate('/admin')
      }
      } catch {   
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Algo deu errado ao atualizar a postagem!"
        });
      }
    } else {
      try {
        const returnData = await createPost(dataParaEnvio);
        if (returnData.statusCode === 200) {
          Swal.fire({
            title: "sucesso!",
            icon: "success",
            text: "a postagem foi criada com sucesso!",
            draggable: true
          });
          navigate('/admin')
        };
      }  catch {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Algo deu errado ao criar o postagem!"
        });
      }
    }
  }

  return { handleSubmit };
}
