export interface GetPostService {
  id: string;
  title: string;
  description: string;
  search: string;
  introduction: string;
  external_link: Record<string, string>;
  content_hashtags: string[];
  style_id: string;
  image: string;
  created_at: Date;
  updated_at: Date;
  user_id: string;
}
