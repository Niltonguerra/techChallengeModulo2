import type { FormPostData, FormUserData } from "../types/form-post";

export const initialFormPostState: FormPostData = {
  title: '',
  description: '',
  introduction: '',
  external_link: {},
  content_hashtags: [],
  image: null,
  author_id: '',
};

export const initialFormUserState: FormUserData = {
  name: '',
  email: '',
  password: '',
  photo: null,
};

export const initialFormQuestionState: import("../types/form-post").FormQuestionData = {
  title: '',
  description: '',
  tags: '',
  author_id: '',
};

export const schoolSubjects = [
  { value: 'Matemática', label: 'Matemática' },
  { value: 'Português', label: 'Português' },
  { value: 'História', label: 'História' },
  { value: 'Geografia', label: 'Geografia' },
  { value: 'Ciências', label: 'Ciências' },
  { value: 'Física', label: 'Física' },
  { value: 'Química', label: 'Química' },
  { value: 'Biologia', label: 'Biologia' },
  { value: 'Inglês', label: 'Inglês' },
  { value: 'Artes', label: 'Artes' },
  { value: 'Educação Física', label: 'Educação Física' },
];