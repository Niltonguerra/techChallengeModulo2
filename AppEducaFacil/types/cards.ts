export type CardPostProps = {
  isEditable: boolean;
  dataProperties: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    introduction: string;
    content_hashtags: string[];
    external_link: Record<string, string>;
    created_at: string;
    updated_at: string;
    author: string;
    authorEmail: string;
  }
};
