import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type EmailCampaignStatus =
  | 'draft'
  | 'scheduled'
  | 'sending'
  | 'sent';

@Entity({ name: 'email_campaigns' })
export class EmailCampaign {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'varchar', length: 200 })
  name!: string;

  @Column({ type: 'varchar', length: 200 })
  subject!: string;

  @Column({ type: 'varchar', length: 200, default: 'default' })
  template!: string;

  @Column({ type: 'varchar', length: 20, default: 'draft' })
  status!: EmailCampaignStatus;

  @Column({ type: 'int', default: 0 })
  recipients!: number;

  @Column({ type: 'numeric', precision: 5, scale: 2, default: 0 })
  openRate!: number;

  @Column({ type: 'numeric', precision: 5, scale: 2, default: 0 })
  clickRate!: number;

  @Column({ type: 'int', default: 0 })
  sentCount!: number;

  @Column({ type: 'timestamptz', nullable: true })
  sentDate!: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  scheduledDate!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
