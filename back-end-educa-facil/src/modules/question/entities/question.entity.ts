import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToOne,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '@modules/user/entities/user.entity';
import { Conversation } from './conversation.entity';
import { SchoolSubject } from '@modules/school_subject/entities/school_subject.entity';
import { QuestionStatus } from '../enum/question-status.enum';

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

  @Column({
    name: 'status',
    type: 'enum',
    enum: QuestionStatus,
    default: QuestionStatus.OPEN,
  })
  status: QuestionStatus;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'id_admin' })
  admin: User;

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

  @OneToMany(() => Conversation, (conversation) => conversation.question) /* //<< double check com os outros - one to one -> one to many */
  conversations: Conversation[];

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
