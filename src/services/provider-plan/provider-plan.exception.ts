import { HttpStatus } from '@nestjs/common';
import { BaseServiceException } from 'src/common/exceptions/base-service.exception';

export enum ProviderPlanErrorCodes {
  COVERAGE_PROVIDER_NOT_FOUND = 'COVERAGE_PROVIDER_NOT_FOUND',
  COVERAGE_PROVIDER_NAME_ALREADY_EXISTS = 'COVERAGE_PROVIDER_NAME_ALREADY_EXISTS',
  COVERAGE_PROVIDER_CREATION_FAILED = 'COVERAGE_PROVIDER_CREATION_FAILED',
  COVERAGE_PROVIDER_UPDATE_FAILED = 'COVERAGE_PROVIDER_UPDATE_FAILED',
  COVERAGE_PROVIDER_DELETION_FAILED = 'COVERAGE_PROVIDER_DELETION_FAILED',
  COVERAGE_PROVIDER_SEARCH_FAILED = 'COVERAGE_PROVIDER_SEARCH_FAILED',
}

export class ProviderPlanException extends BaseServiceException {
  constructor(message: string, errorCode: ProviderPlanErrorCodes, status: HttpStatus, cause?: Error) {
    super(message, errorCode, status, cause);
  }
}
