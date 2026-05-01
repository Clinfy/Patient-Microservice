import { Injectable } from '@nestjs/common';
import { PatientRepository } from 'src/services/patient/patient.repository';
import { Patient } from 'generated/prisma/client';
import { RequestContextService } from 'src/common/context/request-context.service';
import { CreatePatientDto } from 'src/interfaces/dto/patient.dto';
import { toPrismaJsonUser } from 'src/common/mappers/auth-user.mapper';
import { PatientErrorCodes, PatientException } from 'src/services/patient/patient.exception';
import { getErrorStatus, getSafeError } from 'src/common/utils/get-safe-error.util';

@Injectable()
export class PatientService {
  constructor(
    private readonly patientRepository: PatientRepository,
    private readonly contextService: RequestContextService,
  ) {}

  async create(dto: CreatePatientDto): Promise<Patient> {
    try {
      return this.patientRepository.save({
        ...dto,
        created_by: toPrismaJsonUser(this.contextService.getCurrentUser()),
      });
    } catch (error) {
      throw new PatientException(
        'Patient creation failed',
        PatientErrorCodes.PATIENT_CREATION_FAILED,
        getErrorStatus(error),
        getSafeError(error),
      );
    }
  }
}
