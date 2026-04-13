import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, Unique, UpdateDateColumn } from 'typeorm';
import { ProviderPlanEntity } from 'src/entities/provider-plan.entity';
import type { AuthUser } from 'src/clients/auth/auth.interface';

@Unique('UQ_coverage_provider_provider_name', ['provider_name'])
@Entity('coverage_provider')
export class CoverageProviderEntity extends BaseEntity {
  @PrimaryColumn('uuid', { default: () => 'uuidv7()' })
  id: string;

  @Column()
  provider_name: string;

  @OneToMany(() => ProviderPlanEntity, (plan) => plan.coverage_provider)
  provider_plans: ProviderPlanEntity[];

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @Column('jsonb', { nullable: true })
  created_by: AuthUser | null;

  @UpdateDateColumn()
  updated_at: Date;
}
