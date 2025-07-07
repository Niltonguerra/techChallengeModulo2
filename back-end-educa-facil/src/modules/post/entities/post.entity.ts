import { User } from '@modules/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity({
  name: 'Post',
})
export class Post {
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

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL', eager: true })
  @JoinColumn({ name: 'authorId' })
  author?: User;

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

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('text', { nullable: true })
  search?: string;

  @BeforeInsert()
  @BeforeUpdate()
  updateSearchField() {
    const fields = [this.title, this.description, this.authorId, this.image, this.author?.name];
    this.search = fields.filter(Boolean).join(' ').toLowerCase();
  }

  @Column({
    name: 'authorId',
    type: 'uuid',
  })
  authorId?: string;
}
