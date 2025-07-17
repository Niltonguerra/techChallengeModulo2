import { Post } from '@modules/post/entities/post.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserStatusEnum } from '../enum/status.enum';
import { UserPermissionEnum } from '../enum/permission.enum';
import { IUser } from './interfaces/user.interface';

@Entity({
  name: 'User',
})
export class User implements IUser {
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
    nullable: true,
    type: 'jsonb',
    name: 'social_midia',
  })
  social_midia: Record<string, string>;

  @Column({
    type: 'varchar',
    name: 'permission',
  })
  permission: UserPermissionEnum;

  @Column({
    type: 'varchar',
    name: 'is_active',
  })
  is_active: UserStatusEnum;

  @Column({
    type: 'boolean',
    name: 'notification',
  })
  notification: boolean;

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

  // @OneToMany(() => Post, (post) => post.id, { cascade: true })
  // posts?: Post[] | undefined;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}
