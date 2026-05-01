import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

export interface ChartPoint {
  name: string;
  visits: number;
  clicks: number;
}

export interface RecentActivity {
  id: number;
  campaign: string;
  performance: string;
  time: string;
}

@Entity({ name: 'analytics_snapshots' })
export class AnalyticsSnapshot {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'varchar', length: 30, default: 'daily' })
  period!: string;

  @Column({ type: 'int', default: 0 })
  totalReach!: number;

  @Column({ type: 'int', default: 0 })
  impressions!: number;

  @Column({ type: 'int', default: 0 })
  clickRate!: number;

  @Column({ type: 'numeric', precision: 5, scale: 2, default: 0 })
  conversion!: number;

  @Column({ type: 'jsonb', default: () => `'[]'` })
  chartData!: ChartPoint[];

  @Column({ type: 'jsonb', default: () => `'[]'` })
  recentActivity!: RecentActivity[];

  @CreateDateColumn()
  createdAt!: Date;
}
