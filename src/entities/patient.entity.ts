import { BaseEntity, Column, CreateDateColumn, Entity, Index, PrimaryColumn, Unique, UpdateDateColumn } from 'typeorm';
import type { AuthUser } from 'src/clients/auth/auth.interface';

@Unique('UQ_patient_person_id', ['person_id'])
@Unique('UQ_patient_medical_record_number', ['medical_record_number'])
@Entity('patient')
export class PatientEntity extends BaseEntity {
  @PrimaryColumn('uuid', { default: () => 'uuidv7()' })
  id: string;

  @Index('IDX_patient_person_id')
  @Column('uuid')
  person_id: string;

  @Index('IDX_patient_medical_record_number')
  @Column()
  medical_record_number: string;

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
