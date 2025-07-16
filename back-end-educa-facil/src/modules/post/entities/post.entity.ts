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

  @ManyToOne(() => User, (user) => user.posts, { nullable: true })
@JoinColumn({ name: 'user_id' }) // se quiser especificar nome da FK
  user: User;


  @Column('text', { nullable: true })
  search?: string;

  @BeforeInsert()
  @BeforeUpdate()
  updateSearchField() {
    const fields = [this.title, this.description, this.user, this.image];
    this.search = fields.filter(Boolean).join(' ').toLowerCase();
  }
}
