import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import type { AuthUser } from 'src/clients/auth/auth-client.interface';
import { PatientCoverageEntity } from 'src/entities/patient-coverage.entity';
import { PatientAdministrativeNoteEntity } from 'src/entities/patient-admin-note.entity';
import { PatientRelatedContactEntity } from 'src/entities/patient-related-contact.entity';

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

  @OneToMany(() => PatientCoverageEntity, (coverage) => coverage.patient)
  coverages: PatientCoverageEntity[];

  @OneToMany(() => PatientRelatedContactEntity, (contacts) => contacts.patient)
  related_contacts: PatientRelatedContactEntity[];

  @OneToMany(() => PatientAdministrativeNoteEntity, (notes) => notes.patient)
  administrative_notes: PatientAdministrativeNoteEntity[];

  @CreateDateColumn()
  created_at: Date;

  @Column('jsonb', { nullable: true })
  created_by: AuthUser | null;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('jsonb', { nullable: true })
  updated_by: AuthUser | null;
}
