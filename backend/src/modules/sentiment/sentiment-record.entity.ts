import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type SentimentLabel = 'positive' | 'neutral' | 'negative';

@Entity({ name: 'sentiment_records' })
export class SentimentRecord {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'text' })
  text!: string;

  @Column({ type: 'varchar', length: 20 })
  sentiment!: SentimentLabel;

  @Column({ type: 'numeric', precision: 4, scale: 3, default: 0 })
  score!: number;

  @Column({ type: 'varchar', length: 120, nullable: true })
  source!: string | null;

  @Column({ type: 'text', array: true, default: () => 'ARRAY[]::text[]' })
  highlights!: string[];

  @CreateDateColumn()
  createdAt!: Date;
}
