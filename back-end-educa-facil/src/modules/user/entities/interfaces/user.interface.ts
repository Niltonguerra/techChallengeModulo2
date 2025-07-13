import { Post } from '@modules/posts/entities/post.entity';
import { UserStatus } from '../enum/status.enum';
import { UserPermission } from '../enum/permission.enum';

export interface IUser {
  id: string;
  name: string;
  password: string;
  photo: string;
  email: string;
  social_midia?: Record<string, string> | undefined;
  permission: UserPermission;
  isActive: UserStatus;
  notification: boolean;
  created_at?: Date;
  updated_at?: Date;
  posts?: Post[] | undefined;
}
