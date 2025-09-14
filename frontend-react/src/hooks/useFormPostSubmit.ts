import { formPostSchema } from '../schemas/form-post.schema';
import type { FormPostData, LinkItem } from '../types/form-post';
import { imgbbUmaImagem } from '../service/imgbb';
import { createPost, updatePost } from '../service/api';

interface UseFormPostSubmitParams {
  form: FormPostData;
  links: LinkItem[];
  author_id: string;
  setErrors: (errors: Record<string, string>) => void;
}

export function useFormPostSubmit({ form, links, author_id, setErrors }: UseFormPostSubmitParams) {
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Monta external_link a partir dos pares key/value
    const external_link = links.reduce((acc, { key, value }) => {
      if (key && value) acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    let dataParaEnvio: FormPostData = {
      ...form,
      external_link,
      author_id,
    };

    // Validação com Zod
    const result = formPostSchema.safeParse(dataParaEnvio);
    const newErrors: Record<string, string> = {};
    if (!result.success) {
      for (const err of result.error.issues) {
        if (err.path && err.path.length > 0) {
          newErrors[err.path[0] as string] = err.message;
        }
      }
    }
    // Validação manual da imagem
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

    // Upload da imagem se necessário
    if (dataParaEnvio.image && typeof dataParaEnvio.image !== 'string') {
      const foto = await imgbbUmaImagem(dataParaEnvio.image as Blob);
      dataParaEnvio = {
        ...dataParaEnvio,
        image: foto ?? undefined,
      };
    }

    // Decide entre update e create
    if (dataParaEnvio.id) {
      await updatePost(dataParaEnvio);
    } else {
      await createPost(dataParaEnvio);
    }
  }

  return { handleSubmit };
}
