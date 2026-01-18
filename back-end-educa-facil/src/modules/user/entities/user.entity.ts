import { Comments } from '@modules/comments/entities/comment.entity';
import { Post } from '@modules/post/entities/post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserPermissionEnum } from '../../auth/Enum/permission.enum';
import { UserStatusEnum } from '../enum/status.enum';
import { SchoolSubject } from '@modules/school_subject/entities/school_subject.entity';
import { Question } from '@modules/question/entities/question.entity';

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
  permission: UserPermissionEnum;

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

  @ManyToMany(() => SchoolSubject, (school_subject) => school_subject.users)
  @JoinTable({
    name: 'user_school_subjects',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'school_subject_id',
      referencedColumnName: 'id',
    },
  })
  school_subjects: SchoolSubject[];

  @ManyToMany(() => Question, (question) => question.users)
  questions: Question[];
}
