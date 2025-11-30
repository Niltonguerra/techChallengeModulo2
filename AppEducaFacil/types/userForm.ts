import { ImagePickerAsset } from "expo-image-picker";
import { UserPermissionEnum } from "./userPermissionEnum";

export interface PropsCreateUserForm {
  permission: UserPermissionEnum;
  userId?: string;
  afterSubmit?: () => void;
}

export interface SubmitUserData {
  name: string;
  email: string;
  password: string;
  imageUri: any;
  photoAsset: ImagePickerAsset | null;
  setErrors: (errors: any) => void; // Função para atualizar os erros na tela
}

export interface UseUserSubmitProps {
  userId?: string;
  userType?: UserPermissionEnum;
  afterSubmit?: () => void;
}

export interface UserSchemaType {
  name: string;
  email: string;
  password: string;
  photo: any;
}

export interface FormUserData {
  id?: string;
  name: string;
  email: string;
  password?: string;
  photo: File | null | string;
  permission?: UserPermissionEnum;
}

export type FormUserProps = {
  userId?: string
  afterSubmit?: () => void
  userType?: UserPermissionEnum;
  user: FormUserData | null;
}