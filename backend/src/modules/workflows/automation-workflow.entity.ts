import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type WorkflowStatus = 'Active' | 'Paused';

@Entity({ name: 'automation_workflows' })
export class AutomationWorkflow {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'varchar', length: 200 })
  name!: string;

  @Column({ type: 'varchar', length: 30, default: 'n8n' })
  tool!: string;

  @Column({ type: 'varchar', length: 200 })
  trigger!: string;

  @Column({ type: 'varchar', length: 200 })
  action!: string;

  @Column({ type: 'varchar', length: 20, default: 'Paused' })
  status!: WorkflowStatus;

  @Column({ type: 'timestamptz', nullable: true })
  lastRun!: Date | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  n8nWorkflowId!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
