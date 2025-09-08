import { z } from 'zod';
import { formPostSchema } from '../schemas/form-post.schema';
import type { FormPostData } from '../types/form-post';
import { imgbbUmaImagem } from '../service/imgbb';
import { createPost, updatePost } from '../service/api';

interface UseFormPostSubmitParams {
  form: FormPostData;
  links: [{ key: string; value: string }];
  author_id: string;
  setErrors: (errors: Record<string, string>) => void;
}

export function useFormPostSubmit({ form, links, author_id, setErrors }: UseFormPostSubmitParams) {
  async function handleSubmit(e: React.FormEvent) {

    e.preventDefault();
    // Monta o objeto external_link a partir dos pares key/value
    const external_link: Record<string, string> = {};
    links.forEach(({ key, value }) => {
      if (key && value) external_link[key] = value;
    });

    let dataParaEnvio: FormPostData = {
      id: form.id,
      title: form.title,
      description: form.description,
      introduction: form.introduction,
      external_link,
      content_hashtags: form.content_hashtags,
      style_id: form.style_id,
      image: form.image,
      author_id: author_id,
    };


    // Validação com Zod
    const result = formPostSchema.safeParse({ ...dataParaEnvio });
    const newErrors: Record<string, string> = {};
    if (!result.success) {
      result.error.issues.forEach((err: z.ZodIssue) => {
        if (err.path && err.path.length > 0) {
          newErrors[err.path[0] as string] = err.message;
        }
      });
    }
    // // Validação manual da imagem
    // if (form.image && form.image.type && !form.image.type.startsWith('image/')) {
    //   newErrors['image'] = 'O arquivo deve ser uma imagem válida';
    // }

    setErrors(newErrors);
    console.log('Erros de validação:', newErrors); // Log detalhado dos erros para debug
    if (Object.keys(newErrors).length > 0) return;


    // Só faz upload se for arquivo (File), senão mantém a string/url

    const foto = await imgbbUmaImagem(dataParaEnvio.image as Blob);
    dataParaEnvio = {
      ...dataParaEnvio,
      image: foto.imagem_grande ?? undefined
    };
    
    if(dataParaEnvio.id){
      await updatePost(dataParaEnvio);
    }
    
    if(!dataParaEnvio.id){
      await createPost(dataParaEnvio);
    }


  }

  return { handleSubmit };
}
