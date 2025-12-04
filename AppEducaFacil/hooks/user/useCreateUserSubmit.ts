import { useState } from 'react';
import { z } from 'zod';
import type { ImagePickerAsset } from 'expo-image-picker';
import { createUser, EditUser } from '@/services/user';
import { imgbbUmaImagem } from '@/services/imgbb';
import { UserPermissionEnum } from '@/types/userPermissionEnum';
import { FormUserData, SubmitUserData, UseUserSubmitProps } from '@/types/userForm';
import { getUserFormSchema, UserSchemaType } from '@/schemas/useSchema';
import { useSnackbar } from '../snackbar/snackbar';
import { AxiosError } from 'axios';
import { useRouter } from 'expo-router';

export function useCreateUserSubmit({ userId, userType = UserPermissionEnum.USER }: UseUserSubmitProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSnackbar } = useSnackbar();
  const router = useRouter();
  const validate = (data: SubmitUserData): boolean => {
    try {
      const schema = getUserFormSchema(!!userId);

      const formData:UserSchemaType = {
        name: data.name,
        email: data.email,
        password: data.password,
        photo: data.imageUri
      };

      schema.parse(formData);
      
      data.setErrors({}); 
      return true;

    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: { [key: string]: string } = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        data.setErrors(newErrors);
      } else {
        console.error("Erro inesperado na validação:", error);
      }
      return false;
    }
  };

  const handleUserSubmit = async (data: SubmitUserData): Promise<void> => {
    if (!validate(data)) {
      return;
    }

    setIsSubmitting(true);
    const formData: FormUserData = {
      id: userId || undefined,
      name: data.name,
      email: data.email,
      password: data.password.length > 0 ? data.password : undefined,
      photo: data.imageUri,
      permission: userType,
    };

    if (data.photoAsset) {
      try {
        const cdn = await imgbbUmaImagem(data.photoAsset);
        formData.photo = cdn.data?.url || cdn.data?.display_url;
      } catch (error) {
        setIsSubmitting(false);
        showSnackbar({message: "Não foi possível fazer o upload da imagem."});
        return;
      }
    }

    try {
      const returnData = await createUser(formData);
      if (returnData.statusCode === 200) {
        showSnackbar({ message: 'usuário cadastrado com sucesso, valide seu email por favor',duration : 10000 });
        setIsSubmitting(false);
        router.back(); 
      }
      } catch (error:unknown) {
        if (error instanceof AxiosError && error.response && error.response.status === 409) {
          showSnackbar({ message: 'Usuário já existe'});
          setIsSubmitting(false);
        } else {
          showSnackbar({ message: 'Ocorreu um erro ao enviar o formulário.'});
          setIsSubmitting(false);
        }
      }
  };

  return {
    handleUserSubmit, 
    isSubmitting 
  };
}