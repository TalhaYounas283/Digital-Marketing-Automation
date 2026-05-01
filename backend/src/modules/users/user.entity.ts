import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type UserRole = 'owner' | 'manager' | 'admin';

export interface NotificationPrefs {
  leads: boolean;
  campaigns: boolean;
  weekly: boolean;
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 120 })
  name!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 180 })
  email!: string;

  @Column({ type: 'varchar', length: 200 })
  passwordHash!: string;

  @Column({ type: 'varchar', length: 20, default: 'manager' })
  role!: UserRole;

  @Column({ type: 'varchar', length: 120, default: 'AutoMarketer Workspace' })
  organization!: string;

  @Column({ type: 'text', nullable: true })
  profilePicture!: string | null;

  @Column({
    type: 'jsonb',
    default: () => `'{"leads": true, "campaigns": true, "weekly": false}'`,
  })
  notificationPrefs!: NotificationPrefs;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
