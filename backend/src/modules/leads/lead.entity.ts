import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Converted';

@Entity({ name: 'leads' })
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'varchar', length: 200 })
  name!: string;

  @Column({ type: 'varchar', length: 200 })
  email!: string;

  @Column({ type: 'varchar', length: 120 })
  source!: string;

  @Column({ type: 'varchar', length: 20, default: 'New' })
  status!: LeadStatus;

  @Column({ type: 'int', default: 0 })
  score!: number;

  @Column({ type: 'text', nullable: true })
  aiAnalysis!: string | null;

  @Column({ type: 'text', nullable: true })
  interactions!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
