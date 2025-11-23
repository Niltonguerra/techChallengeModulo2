import { Comments } from '@modules/comments/entities/comment.entity';
import { User } from '@modules/user/entities/user.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostStatusEnum } from '../controller/enum/status.enum';

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

  @OneToMany(() => Comments, (comment) => comment.post)
  comments: Comment[];

  @Column({ name: 'is_active', type: 'varchar', default: 'active' })
  is_active: PostStatusEnum;

  @BeforeInsert()
  @BeforeUpdate()
  updateSearchField() {
    const fields = [this.title, this.description];
    this.search = fields.filter(Boolean).join(' ').toLowerCase();
  }
}
