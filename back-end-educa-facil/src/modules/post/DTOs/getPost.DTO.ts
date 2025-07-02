export class GetPostDTO {
  title: string;
  description: string;
  search_field: string[];
  introduction?: string;
  external_link: Record<string, string>;
  content_hashtags: string[];
  style_id: string;
  image?: string;
  created_at: Date;
  updated_at: Date;
  author_name?: string;
  author_email?: string;
}
