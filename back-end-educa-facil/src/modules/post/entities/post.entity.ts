import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IPost } from './models/post.interface';

@Entity()
export class Post implements IPost {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id: string;

  @Column({
    name: 'title',
    type: 'varchar',
  })
  title: string;

  @Column({
    name: 'description',
    type: 'varchar',
  })
  description: string;

  @Column({
    type: 'varchar',
    array: true,
    name: 'search_field',
  })
  search_field: string[];

  @Column({
    nullable: true,
    name: 'introduction',
    type: 'varchar',
  })
  introduction?: string;

  @Column({
    nullable: true,
    type: 'jsonb',
    name: 'external_link',
  })
  external_link: Record<string, string>;

  @Column({
    type: 'varchar',
    array: true,
    name: 'content_hashtags',
  })
  content_hashtags: string[];

  @Column({
    type: 'varchar',
    name: 'style_id',
  })
  style_id: string;

  @Column({
    nullable: true,
    type: 'varchar',
    name: 'image',
  })
  image?: string;

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

  @Column({
    name: 'author_id',
    type: 'uuid',
  })
  author_id?: string;
}
