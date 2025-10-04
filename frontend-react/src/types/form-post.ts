// Tipos para o formulário de post

export interface FormPostData {
	id?: string;
	title: string;
	description: string;
	introduction: string;
	external_link: Record<string, string>;
	content_hashtags: string[];
	image: File | null | string;
	author_id: string;
}

export interface FormUserData {
  id?: string;
  name: string;
  email: string;
  password?: string;
  photo: File | null | string;
  permission?: string;
}

export type LinkItem = { key: string; value: string };

export interface Foto{
  imagem_grande: string;
  imagem_media: string;
  imagem_pequena: string;
  excluir: string;
}



export interface DynamicLinksInputProps {
  links: { key: string; value: string }[];
  onChange: (links: { key: string; value: string }[]) => void;
  error?: string;
}

export interface ImageUploadProps {
  image: File | null | string;
  onChange: (file: File | null) => void;
  preview: string | null;
  setPreview: (url: string | null) => void;
  error?: string;
}


export interface DynamicFieldItem {
  key: string;
  value: string;
}

export interface DynamicFieldsInputProps<T = DynamicFieldItem> {
  items: T[];
  onChange: (items: T[]) => void;
  keyLabel?: string;
  valueLabel?: string;
  error?: string;
  allowKeyEdit?: boolean;
  addButtonLabel?: string;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  renderExtraFields?: (item: T, idx: number, items: T[], onChange: (items: T[]) => void) => React.ReactNode;
}

export interface UseFormPostSubmitParams {
  form: FormPostData;
  links: LinkItem[];
  setErrors: (errors: Record<string, string>) => void;
  setLoading: (loading: boolean) => void;
}