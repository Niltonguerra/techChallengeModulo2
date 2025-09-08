import type { FormPostData } from "../types/form-post";

export const initialState: FormPostData = {
  title: '',
  description: '',
  scheduled_publication: '',
  introduction: '',
  external_link: {},
  content_hashtags: [],
  style_id: '',
  image: null,
  author_id: '',
};