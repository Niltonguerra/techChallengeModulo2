export type CardPostProps = {
  isEditable: boolean;
  dataProperties: {
    id: string;
    title: string;
    description: string;
    image: string;
    introduction: string;
    content_hashtags: string[];
    external_link: Record<string, string>;
    created_at: string;
    updated_at: string;
    author: string;
    authorEmail: string;
  }
};

export type CardUserProps = {
  isEditable: boolean;
  dataProperties: {
    id: string;
    name: string;
    photo: string;
    email: string;
  };
}
