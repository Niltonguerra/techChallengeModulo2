import type { FormQuestionData } from "../types/form-post";
import { useNavigate } from 'react-router-dom';
import { formQuestionSchema } from '../schemas/form-question.schema';
import { createQuestion } from "../service/question";
import { useSnackbar } from "../store/snackbar/useSnackbar";
import { AxiosError } from "axios";

interface UseFormQuestionSubmitParams {
  form: FormQuestionData;
  setErrors: (errors: Record<string, string>) => void;
  setLoading: (loading: boolean) => void;
}

export function useFormQuestionSubmit({ form, setErrors, setLoading }: UseFormQuestionSubmitParams) {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  async function handleSubmit(e: React.FormEvent) {
    setLoading(true);
    e.preventDefault();

    const result = formQuestionSchema.safeParse(form);
    const newErrors: Record<string, string> = {};
    if (!result.success) {
      for (const err of result.error.issues) {
        if (err.path && err.path.length > 0) {
          newErrors[err.path[0] as string] = err.message;
        }
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setLoading(false);
      return;
    }

    try {
      const returnData = await createQuestion(form);
      if (returnData.statusCode === 201) {
        showSnackbar({ message: 'Pergunta criada com sucesso!', severity: 'success' });
        setLoading(false);
        navigate(-1);
      }
    }  catch (error:unknown) {
        if (error instanceof AxiosError) {
             showSnackbar({ message: 'Algo deu errado ao criar a pergunta!', severity: 'error' });
        } else {
             showSnackbar({ message: 'Algo deu errado ao criar a pergunta!', severity: 'error' });
        }
        setLoading(false);
    }
  }
  return { handleSubmit };
}
