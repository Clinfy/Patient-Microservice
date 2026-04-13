import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import type { AuthUser } from 'src/clients/auth/auth.interface';
import { CoverageProviderEntity } from 'src/entities/coverage-provider.entity';

@Unique('UQ_provider_plan_plan_name', ['coverage_provider', 'plan_name'])
@Unique('UQ_provider_plan_plan_code', ['coverage_provider', 'plan_code'])
@Entity('provider_plan')
export class ProviderPlanEntity extends BaseEntity {
  @PrimaryColumn('uuid', { default: () => 'uuidv7()' })
  id: string;

  @Column()
  plan_name: string;

  @Column()
  plan_code: string;

  @Column({ default: true })
  is_active: boolean;

  @ManyToOne(() => CoverageProviderEntity, (provider) => provider.provider_plans, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  coverage_provider: CoverageProviderEntity;

  @CreateDateColumn()
  created_at: Date;

  @Column('jsonb', { nullable: true })
  created_by: AuthUser | null;

  @UpdateDateColumn()
  updated_at: Date;
}
