import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'uuid', nullable: true })
  authorId?: string;

  /* //<< when user is done
  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'author_id' })
  author?: User;
  */

  @Column({ length: 100, nullable: true })
  image?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('text', { nullable: true })
  search?: string;

  @BeforeInsert()
  @BeforeUpdate()
  updateSearchField() {
    const fields = [this.title, this.description, this.authorId, this.image]; /*, this.author.name*/ //<<
    this.search = fields.filter(Boolean).join(' ').toLowerCase();
  }
}
