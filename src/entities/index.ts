import { CoverageProviderEntity } from 'src/entities/coverage-provider.entity';
import { PatientEntity } from 'src/entities/patient.entity';
import { PatientAdministrativeNoteEntity } from 'src/entities/patient-admin-note.entity';
import { PatientCoverageEntity } from 'src/entities/patient-coverage.entity';
import { PatientRelatedContactEntity } from 'src/entities/patient-related-contact.entity';
import { ProviderPlanEntity } from 'src/entities/provider-plan.entity';

export const ENTITIES = [
  CoverageProviderEntity,
  PatientEntity,
  PatientAdministrativeNoteEntity,
  PatientCoverageEntity,
  PatientRelatedContactEntity,
  ProviderPlanEntity,
];
