import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { AuthUser } from 'src/clients/auth/auth.interface';
import { PatientEntity } from 'src/entities/patient.entity';
import { CoverageProviderEntity } from 'src/entities/coverage-provider.entity';
import { ProviderPlanEntity } from 'src/entities/provider-plan.entity';
import { RelationshipType } from 'src/interfaces/enums/relationship.enum';

export enum AffiliateType {
  HOLDER = 'HOLDER',
  MEMBER = 'MEMBER',
  FAMILY_GROUP = 'FAMILY_GROUP',
  INDIVIDUAL = 'INDIVIDUAL',
}

@Entity('patient_coverage')
export class PatientCoverageEntity extends BaseEntity {
  @PrimaryColumn('uuid', { default: () => 'uuidv7()' })
  id: string;

  @Column('uuid')
  patient_id: string;

  @ManyToOne(() => PatientEntity, (patient) => patient.coverages, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'patient_id' })
  patient: PatientEntity;

  @Column('uuid')
  coverage_provider_id: string;

  @ManyToOne(() => CoverageProviderEntity, (provider) => provider.patient_coverages, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'coverage_provider_id' })
  coverage_provider: CoverageProviderEntity;

  @Column('uuid')
  provider_plan_id: string;

  @ManyToOne(() => ProviderPlanEntity, (plan) => plan.patient_coverages, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'provider_plan_id' })
  provider_plan: ProviderPlanEntity;

  @Column()
  member_number: string;

  @Column({ default: true })
  is_active: boolean;

  @Column('date')
  valid_from: string;

  @Column({ type: 'date', nullable: true })
  valid_until: string | null;

  @Column({ nullable: true })
  notes: string | null;

  @Column({ type: 'enum', enum: AffiliateType, nullable: false })
  affiliate_type: AffiliateType;

  @Column({ type: 'enum', enum: RelationshipType, nullable: true })
  relationship_type: RelationshipType | null;

  @CreateDateColumn()
  created_at: Date;

  @Column('jsonb', { nullable: true })
  created_by: AuthUser | null;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('jsonb', { nullable: true })
  updated_by: AuthUser | null;
}
