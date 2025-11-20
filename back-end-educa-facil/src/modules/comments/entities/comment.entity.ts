/* eslint-disable prettier/prettier */
import { Post } from '@modules/post/entities/post.entity';
import { User } from '@modules/user/entities/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('comments')
export class Comments {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text' })
    content: string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE', nullable: false })
    user: User;

    @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE', nullable: false })
    post: Post;
}
