import { Post } from "./post";

export type CardPostProps = {
  isEditable: boolean;
  dataProperties: Post;
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
