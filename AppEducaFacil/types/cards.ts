import { Post } from "./post";

export type CardPostProps = {
  isEditable: boolean;
  dataProperties: Post;
  onEdit?: (id: string, updatedData: Partial<Post>) => void;
  onDelete?: (id: string) => void;
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
