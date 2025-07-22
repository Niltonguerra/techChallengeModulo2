import { Post } from '@modules/post/entities/post.entity';
import { UserStatusEnum } from '../../enum/status.enum';
import { UserPermissionEnum } from '../../../auth/Enum/permission.enum';

export interface IUser {
  id: string;
  name: string;
  password: string;
  photo: string;
  email: string;
  social_midia?: Record<string, string> | undefined;
  permission: UserPermissionEnum;
  is_active: UserStatusEnum;
  notification: boolean;
  created_at?: Date;
  updated_at?: Date;
  posts?: Post[] | undefined;
}
