import { Post } from "./post";
import { UserPermissionEnum } from "./userPermissionEnum";

export type CardPostProps = {
  isEditable: boolean;
  dataProperties: Post;
  onEdit?: (id: string, updatedData: Partial<Post>) => void;
  onDelete?: (id: string) => void;
};

export type CardUserProps = {
  isEditable: boolean;
  returnRoute: string;
  dataProperties: {
    id: string;
    name: string;
    photo: string;
    email: string;
    permission?: UserPermissionEnum;
  };
}
