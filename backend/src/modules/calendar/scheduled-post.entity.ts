import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type ScheduledPostStatus = 'scheduled' | 'published' | 'draft';
export type ScheduledPostType = 'post' | 'story' | 'reel';

@Entity({ name: 'scheduled_posts' })
export class ScheduledPost {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'varchar', length: 200 })
  title!: string;

  @Column({ type: 'varchar', length: 30 })
  platform!: string;

  @Index()
  @Column({ type: 'date' })
  date!: string;

  @Column({ type: 'varchar', length: 16, default: '09:00' })
  time!: string;

  @Column({ type: 'varchar', length: 20, default: 'scheduled' })
  status!: ScheduledPostStatus;

  @Column({ type: 'varchar', length: 20, default: 'post' })
  type!: ScheduledPostType;

  @Column({ type: 'text', nullable: true })
  content!: string | null;

  @Column({ type: 'uuid', nullable: true })
  campaignId!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
