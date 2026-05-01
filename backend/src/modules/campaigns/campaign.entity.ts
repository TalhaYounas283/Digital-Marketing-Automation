import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type CampaignStatus = 'active' | 'paused' | 'completed' | 'draft';
export type CampaignPlatform =
  | 'Facebook'
  | 'Google'
  | 'Instagram'
  | 'LinkedIn'
  | 'Email'
  | 'Twitter';

export interface CampaignSettings {
  dailyCap?: number;
  autoOptimize?: boolean;
  sendAlerts?: boolean;
}

@Entity({ name: 'campaigns' })
export class Campaign {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'varchar', length: 200 })
  name!: string;

  @Column({ type: 'varchar', length: 20, default: 'draft' })
  status!: CampaignStatus;

  @Column({ type: 'varchar', length: 30 })
  platform!: CampaignPlatform;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  budget!: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  spent!: number;

  @Column({ type: 'int', default: 0 })
  clicks!: number;

  @Column({ type: 'int', default: 0 })
  impressions!: number;

  @Column({ type: 'timestamptz', nullable: true })
  startDate!: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  endDate!: Date | null;

  @Column({ type: 'jsonb', default: () => `'{}'` })
  settings!: CampaignSettings;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
