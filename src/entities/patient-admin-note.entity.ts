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
import { PatientEntity } from 'src/entities/patient.entity';
import type { AuthUser } from 'src/clients/auth/auth-client.interface';

export enum CategoryType {
  GENERAL = 'GENERAL',
  CONTACT = 'CONTACT',
  BILLING = 'BILLING',
  COVERAGE = 'COVERAGE',
  GUARDIAN = 'GUARDIAN',
  WARNING = 'WARNING',
}

@Entity('patient_administrative_note')
export class PatientAdministrativeNoteEntity extends BaseEntity {
  @PrimaryColumn('uuid', { default: () => 'uuidv7()' })
  id: string;

  @Column('uuid')
  patient_id: string;

  @ManyToOne(() => PatientEntity, (patient) => patient.administrative_notes, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'patient_id' })
  patient: PatientEntity;

  @Column({ type: 'varchar', length: 500 })
  note: string;

  @Column({ type: 'enum', enum: CategoryType })
  category: CategoryType;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @Column('jsonb', { nullable: true })
  created_by: AuthUser | null;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('jsonb', { nullable: true })
  updated_by: AuthUser | null;
}
