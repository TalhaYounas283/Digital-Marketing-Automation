import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'templates' })
export class Template {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  userId!: string | null;

  @Column({ type: 'varchar', length: 200 })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Index()
  @Column({ type: 'varchar', length: 80 })
  category!: string;

  @Column({ type: 'text', array: true, default: () => 'ARRAY[]::text[]' })
  platform!: string[];

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'text', array: true, default: () => 'ARRAY[]::text[]' })
  tags!: string[];

  @Column({ type: 'int', default: 0 })
  usage!: number;

  @Column({ type: 'numeric', precision: 3, scale: 1, default: 4.5 })
  rating!: number;

  @Column({ type: 'boolean', default: false })
  isPremium!: boolean;

  @Column({ type: 'boolean', default: false })
  isSystem!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
