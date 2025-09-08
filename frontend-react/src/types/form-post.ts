// Tipos para o formulário de post

export interface FormPostData {
	id?: string;
	title: string;
	description: string;
	introduction: string;
	external_link: Record<string, string>;
	content_hashtags: string[];
	style_id: string;
	image: File | null | string;
	author_id: string;
}

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
