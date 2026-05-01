import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type ImpactLevel = 'high' | 'medium' | 'low';
export type InsightCategory = 'timing' | 'audience' | 'content' | 'channel';

@Entity({ name: 'recommendations' })
export class Recommendation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'varchar', length: 200 })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'varchar', length: 10, default: 'medium' })
  impact!: ImpactLevel;

  @Column({ type: 'varchar', length: 30 })
  category!: InsightCategory;

  @Column({ type: 'int', default: 80 })
  confidence!: number;

  @Column({ type: 'boolean', default: false })
  applied!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
