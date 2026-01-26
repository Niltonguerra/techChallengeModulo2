import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './question.entity';
import { User } from '@modules/user/entities/user.entity';

@Entity({
  name: 'conversation',
})
export class Conversation {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    name: 'message',
    type: 'varchar',
  })
  message: string;

  @ManyToOne(() => Question, (q) => q.conversations)
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @Column({
    name: 'created_at',
    type: 'varchar',
  })
  created_at: string;
}
