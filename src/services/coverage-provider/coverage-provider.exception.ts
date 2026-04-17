import { HttpStatus } from '@nestjs/common';
import { BaseServiceException } from 'src/common/exceptions/base-service.exception';

export enum CoverageProviderErrorCodes {
  COVERAGE_PROVIDER_NOT_FOUND = 'COVERAGE_PROVIDER_NOT_FOUND',
  COVERAGE_PROVIDER_NAME_ALREADY_EXISTS = 'COVERAGE_PROVIDER_NAME_ALREADY_EXISTS',
}

export class CoverageProviderException extends BaseServiceException {
  constructor(message: string, errorCode: CoverageProviderErrorCodes, status: HttpStatus, cause?: Error) {
    super(message, errorCode, status, cause);
  }
}
