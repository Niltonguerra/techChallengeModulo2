export class ReturnListPostDTO {
  title: string;
  description: string;
  introduction: string;
  external_link: string;
  content_hashtags: string[];
  style_id: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  total_post: number;
  author_id: {
    name: string;
    email: string;
    social_midia: string;
  };
}
