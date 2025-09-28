import type { FormUserData } from "../types/form-post";
import { useNavigate } from 'react-router-dom';
import { formUserSchema } from '../schemas/form-user.schema';
import { imgbbUmaImagem } from "../service/imgbb";
import { createUser } from "../service/user";
import { AxiosError } from "axios";
import { useSnackbar } from "../store/snackbar/useSnackbar";

interface UseFormUserSubmitParams {
  form: FormUserData;
  permission: string;
  setErrors: (errors: Record<string, string>) => void;
  setLoading: (loading: boolean) => void;
}

export function useFormUserSubmit({ form, permission, setErrors, setLoading }: UseFormUserSubmitParams) {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  async function handleSubmit(e: React.FormEvent) {
    setLoading(true);
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
    if (Object.keys(newErrors).length > 0) {
      setLoading(false);
      return;
    }

    let dataParaEnvio: FormUserData = { ...form };
    if (dataParaEnvio.photo && typeof dataParaEnvio.photo !== 'string') {
      try {
        const foto = await imgbbUmaImagem(dataParaEnvio.photo as Blob);
        dataParaEnvio = {
          ...dataParaEnvio,
          photo: foto ?? undefined,
        };
      }  catch {
        setLoading(false);
        showSnackbar({ message: 'Erro ao fazer upload da imagem!', severity: 'error' });
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
        showSnackbar({ message: 'Usuário criado com sucesso!', severity: 'success' });
        setLoading(false);
        navigate('/');
    }
    }  catch (error:unknown) {
      if (error instanceof AxiosError && error.response && error.response.status === 409) {
        showSnackbar({ message: 'Usuário já existe', severity: 'warning' });
        setLoading(false);
      } else {
        showSnackbar({ message: 'Algo deu errado ao criar o usuário!', severity: 'error' });
        setLoading(false);
      }
    }
  }
  return { handleSubmit };
}
