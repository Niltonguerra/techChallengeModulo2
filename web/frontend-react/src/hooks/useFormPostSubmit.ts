import { formPostSchema } from '../schemas/form-post.schema';
import type { FormPostData, UseFormPostSubmitParams } from '../types/form-post';
import { imgbbUmaImagem } from '../service/imgbb';
import { createPost, updatePost } from '../service/post';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../store/snackbar/useSnackbar';



export function useFormPostSubmit({ form, links, setErrors, setLoading }: UseFormPostSubmitParams) {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  async function handleSubmit(e: React.FormEvent) {
    setLoading(true);
    
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
    if (Object.keys(newErrors).length > 0) {
      setLoading(false);
      return
    };

    if (dataParaEnvio.image && typeof dataParaEnvio.image !== 'string') {
      try {
      const foto = await imgbbUmaImagem(dataParaEnvio.image as Blob);
      
      dataParaEnvio = {
        ...dataParaEnvio,
        image: foto ?? undefined,
      };
      }  catch {
        setLoading(false);
        showSnackbar({ message: 'Algo deu errado ao fazer upload da imagem!', severity: 'error' });
        return;
      }
    }

    if(dataParaEnvio.image == null) {
      dataParaEnvio.image = 'https://i.ibb.co/HDb2X4DL/default-ui-image-placeholder-wireframes-600nw-1037719192.webp'
    }

    if (dataParaEnvio.id) {
      try {
      const returnData = await updatePost(dataParaEnvio);
      if (returnData.statusCode === 200) {
        showSnackbar({ message: 'Postagem atualizada com sucesso!', severity: 'success' });
        setLoading(false);
        navigate('/admin')
      }
      } catch {
        setLoading(false);
        showSnackbar({ message: 'Algo deu errado ao atualizar a postagem!', severity: 'error' });
      }
    } else {
      try {
        const returnData = await createPost(dataParaEnvio);
        if (returnData.statusCode === 200) {
          showSnackbar({ message: 'Postagem criada com sucesso!', severity: 'success' });
          setLoading(false);
          navigate('/admin')
        };
      }  catch {
        setLoading(false);
        showSnackbar({ message: 'Algo deu errado ao criar a postagem!', severity: 'error' });
      }
    }
  }

  return { handleSubmit };
}
