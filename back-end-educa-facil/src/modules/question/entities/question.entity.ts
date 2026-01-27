import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '@modules/user/entities/user.entity';
import { Conversation } from './conversation.entity';
import { SchoolSubject } from '@modules/school_subject/entities/school_subject.entity';

@Entity({
  name: 'question',
})
export class Question {
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

  @ManyToMany(() => User, (user) => user.questions)
  @JoinTable({
    name: 'question_users',
    joinColumn: {
      name: 'question_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  users: User[];

  @ManyToMany(() => SchoolSubject, (subject) => subject.questions)
  @JoinTable({
    name: 'question_school_subjects',
    joinColumn: {
      name: 'question_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'school_subject_id',
      referencedColumnName: 'id',
    },
  })
  school_subjects: SchoolSubject[];

  @OneToMany(() => Conversation, (c) => c.question)
  conversations: Conversation[];

  @Column({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column({ name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
