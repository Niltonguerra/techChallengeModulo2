import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './question.entity';

@Entity({
  name: 'conversation',
})
export class Conversation {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id: string;

  @Column({
    name: 'id_user',
    type: 'varchar',
  })
  id_user: string;

  @Column({
    name: 'message',
    type: 'varchar',
  })
  message: string;

  @ManyToOne(() => Question, (question) => question.conversations, {
    onDelete: 'CASCADE',
  }) /* //<< double check com os outros - on to one -> many to one */
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
