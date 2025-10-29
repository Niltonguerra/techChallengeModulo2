import { Comments } from '@modules/comments/entities/comment.entity';
import { Post } from '@modules/post/entities/post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserPermissionEnum } from '../../auth/Enum/permission.enum';
import { UserStatusEnum } from '../enum/status.enum';

@Entity({
  name: 'User',
})
export class User {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id: string;

  @Column({
    name: 'name',
    type: 'varchar',
  })
  name: string;

  @Column({
    name: 'password',
    type: 'varchar',
  })
  password: string;

  @Column({
    type: 'varchar',
    name: 'photo',
  })
  photo: string;

  @Column({
    name: 'email',
    type: 'varchar',
  })
  email: string;

  @Column({
    type: 'varchar',
    name: 'permission',
  })
  permission: UserPermissionEnum; // admin (teacher), user (student)

  @Column({
    type: 'varchar',
    name: 'is_active',
  })
  is_active: UserStatusEnum;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp with time zone',
  })
  created_at: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp with time zone',
  })
  updated_at: Date;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Comments, (comment) => comment.post)
  comments: Comment[];
}
