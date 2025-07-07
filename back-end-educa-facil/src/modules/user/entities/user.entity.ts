import { Post } from '@modules/post/entities/post.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity({
  name: 'user',
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
    nullable: true,
    type: 'jsonb',
    name: 'social_midia',
  })
  social_midia: Record<string, string>;

  @Column({
    type: 'varchar',
    name: 'permission',
  })
  permission: string;

  @Column({
    type: 'boolean',
    name: 'isActive',
  })
  isActive: boolean;

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

  @OneToMany(() => Post, (post) => post.id, { cascade: true })
  posts?: Post[] | undefined;
}
