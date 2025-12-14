import { ImagePickerAsset } from "expo-image-picker";
import { UserPermissionEnum } from "./userPermissionEnum";
import * as ImagePicker from 'expo-image-picker';

export interface PasswordInputProps {
  userId?: string | null;
  password?: string;
  onPasswordChange: (text: string) => void;
  onSubmit: () => void;
  error?: string;
}

export interface FormUserData {
  id?: string;
  name: string;
  email: string;
  password?: string;
  photo?: File | null | string | ImagePickerAsset;
  permission?: UserPermissionEnum;
}

export type FormUserProps = {
  userId?: string
  afterSubmit?: () => void
  userType?: UserPermissionEnum;
  user: FormUserData | null;
  returnRoute?: string;
}

export type UserFormData = {
  name: string;
  email: string;
  password?: string;
  imageUri?: string | null; 
  photoAsset?: any;         
};

export type UseUserFormProps = {
  userId?: string;
  userType?: UserPermissionEnum;
  userData?: any; 
  returnRoute?: string;
};

export interface PasswordInputProps {
  userId?: string | null;
  password?: string;
  onPasswordChange: (text: string) => void;
  onSubmit: () => void;
  error?: string;
}

export interface UserImagePickerProps {
  imageUri: string | null;
  error?: string;
  onImagePicked: (uri: string, asset: ImagePicker.ImagePickerAsset) => void;
}
