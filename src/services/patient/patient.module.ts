import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { PatientRepository } from 'src/services/patient/patient.repository';

@Module({
  providers: [PatientService, PatientRepository],
  controllers: [PatientController],
})
export class PatientModule {}
