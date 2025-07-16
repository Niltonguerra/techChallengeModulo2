export interface ReturnListPost {
  ListPost: ListPost[];
  total: number;
  limit: number;
  offset: number;
}

export interface ListPost {
  id: string;
  title: string;
  description: string;
  introduction: string;
  external_link: Record<string, string>;
  content_hashtags: string[];
  style_id: string;
  image?: string;
  created_at: Date;
  updated_at: Date;
  user_name: string;
  user_email: string;
  user_social_media: Record<string, string>;
}
