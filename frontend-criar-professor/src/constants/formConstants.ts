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