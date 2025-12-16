import {  useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { createUser, EditUser } from '@/services/user';
import { imgbbUmaImagem } from '@/services/imgbb';
import { FormUserData, UserFormData, UseUserFormProps } from '@/types/userForm';
import { useSnackbar } from '../snackbar/snackbar';
import { editUserSchema } from '@/schemas/useEditUserSchema';
import { createUserSchema } from '@/schemas/useCreateUserSchema';

export function useUserForm({ userId, userType, userData,returnRoute }: UseUserFormProps) {
  const { showSnackbar } = useSnackbar();
  const router = useRouter();
  const isEditing = !!userId;

  const { control, handleSubmit, setValue, setError, formState: { errors, isSubmitting } } = useForm<UserFormData>({
    resolver: zodResolver(isEditing ? editUserSchema : createUserSchema),
    defaultValues: {
      name: userData?.name || '',
      email: userData?.email || '',
      password: '',
      imageUri: userData?.photo ? String(userData.photo) : null,
      photoAsset: null,
    },
  });

  const onValidSubmit = async (data: UserFormData) => {
    try {
      let finalPhotoUrl = data.imageUri;

      if (data.photoAsset) {
        try {
          const cdn = await imgbbUmaImagem(data.photoAsset);
          if (!cdn?.data?.url) throw new Error('UPLOAD_ERROR');
          finalPhotoUrl = cdn.data.url;
        } catch {
          showSnackbar({ message: "Não foi possível fazer o upload da imagem." });
          return;
        }
      }

      const apiPayload: FormUserData = {
        name: data.name,
        email: data.email,
        permission: userType,
        photo: finalPhotoUrl,
        password: data.password || undefined,
      };

      const response = await (isEditing ? EditUser({ ...apiPayload, id: userId }) : createUser(apiPayload));

      if ([200, 201].includes(response.statusCode)) {
        showSnackbar({ message: isEditing ? 'Atualizado com sucesso' : 'Cadastrado com sucesso, por favor valide seu email por favor' });
        if(returnRoute) {
          router.push({// @ts-ignore 
          pathname: returnRoute
          });
        }
      }

    } catch (error: unknown) {
      console.error(error);
      if (error instanceof AxiosError && error.response?.status === 409) {
        setError('email', { message: 'E-mail já cadastrado.' });
        showSnackbar({ message: 'Verifique os erros no formulário.' });
      } else {
        showSnackbar({ message: 'Erro ao salvar.' });
      }
    }
  };

  return {
    control,           
    errors,            
    setValue,          
    submit: handleSubmit(onValidSubmit), 
    isSubmitting
  };
}