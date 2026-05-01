import { HttpStatus } from '@nestjs/common';
import { BaseServiceException } from 'src/common/exceptions/base-service.exception';

export enum PatientErrorCodes {
  PATIENT_NOT_FOUND = 'PATIENT_NOT_FOUND',
  PATIENT_CREATION_FAILED = 'PATIENT_CREATION_FAILED',
}

export class PatientException extends BaseServiceException {
  constructor(message: string, errorCode: PatientErrorCodes, status: HttpStatus, cause?: Error) {
    super(message, errorCode, status, cause);
  }
}
