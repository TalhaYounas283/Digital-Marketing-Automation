import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'generated_contents' })
export class GeneratedContent {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
  userId!: string;

  @Index()
  @Column({ type: 'varchar', length: 80 })
  action!: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  platform!: string | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  tone!: string | null;

  @Column({ type: 'jsonb', default: () => `'{}'` })
  prompt!: Record<string, unknown>;

  @Column({ type: 'jsonb' })
  result!: unknown;

  @Column({ type: 'varchar', length: 30, default: 'n8n' })
  provider!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
