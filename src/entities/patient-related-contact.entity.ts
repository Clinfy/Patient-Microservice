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
import { RelationshipType } from 'src/interfaces/enums/relationship.enum';
import type { AuthUser } from 'src/clients/auth/auth.interface';

@Entity('patient_related_contact')
export class PatientRelatedContactEntity extends BaseEntity {
  @PrimaryColumn('uuid', { default: () => 'uuidv7()' })
  id: string;

  @Column('uuid')
  patient_id: string;

  @ManyToOne(() => PatientEntity, (patient) => patient.related_contacts, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'patient_id' })
  patient: PatientEntity;

  @Column({ type: 'varchar', length: 100 })
  full_name: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  email: string | null;

  @Column({ type: 'enum', enum: RelationshipType })
  relationship_type: RelationshipType;

  @Column({ default: false })
  is_emergency_contact: boolean;

  @Column({ default: false })
  is_default_contact: boolean;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'varchar', length: 200, nullable: true })
  note: string | null;

  @CreateDateColumn()
  created_at: Date;

  @Column('jsonb', { nullable: true })
  created_by: AuthUser | null;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('jsonb', { nullable: true })
  updated_by: AuthUser | null;
}
