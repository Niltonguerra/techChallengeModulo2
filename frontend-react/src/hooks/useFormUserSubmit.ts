import type { FormUserData } from "../types/form-post";
import { useNavigate } from 'react-router-dom';
import { formUserSchema } from '../schemas/form-user.schema';
import { imgbbUmaImagem } from "../service/imgbb";
import { createUser } from "../service/user";
import Swal from "sweetalert2";
import { AxiosError } from "axios";
// import { imgbbUmaImagem } from '../service/imgbb'; // descomente se for usar upload real
// import { createUser } from '../service/api'; // descomente se for usar API real

interface UseFormUserSubmitParams {
  form: FormUserData;
  permission: string;
  setErrors: (errors: Record<string, string>) => void;
}

export function useFormUserSubmit({ form, permission, setErrors }: UseFormUserSubmitParams) {
  const navigate = useNavigate();
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = formUserSchema.safeParse(form);
    const newErrors: Record<string, string> = {};
    if (!result.success) {
      for (const err of result.error.issues) {
        if (err.path && err.path.length > 0) {
          newErrors[err.path[0] as string] = err.message;
        }
      }
    }

    if (
      form.photo &&
      typeof form.photo !== 'string' &&
      'type' in form.photo &&
      form.photo.type &&
      !form.photo.type.startsWith('image/')
    ) {
      newErrors['photo'] = 'O arquivo deve ser uma imagem válida';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    let dataParaEnvio: FormUserData = { ...form };
    if (dataParaEnvio.photo && typeof dataParaEnvio.photo !== 'string') {
      try {
        const foto = await imgbbUmaImagem(dataParaEnvio.photo as Blob);
        dataParaEnvio = {
          ...dataParaEnvio,
          photo: foto ?? undefined,
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
    
    dataParaEnvio = {
      ...dataParaEnvio,
      permission: permission
    };

    try {
      const returnData = await createUser(dataParaEnvio);
      if (returnData.statusCode === 201) {
      Swal.fire({
        title: "sucesso!",
        icon: "success",
        text: "a postagem foi atualizada com sucesso!",
        draggable: true
      });
      navigate('/admin');
    }
    }  catch (error:unknown) {
      if (error instanceof AxiosError && error.response && error.response.status === 409) {
        Swal.fire({
          icon: "error",
          title: "Usuário já existe",
          text: "Já existe um usuário com este e-mail ou dados informados."
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Algo deu errado ao criar o usuário!"
        });
      }
    }
  }

  return { handleSubmit };
}
