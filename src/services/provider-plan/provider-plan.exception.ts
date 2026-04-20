import { HttpStatus } from '@nestjs/common';
import { BaseServiceException } from 'src/common/exceptions/base-service.exception';

export enum ProviderPlanErrorCodes {
  PROVIDER_PLAN_NAME_ALREADY_EXISTS = 'PROVIDER_PLAN_NAME_ALREADY_EXISTS',
  PROVIDER_PLAN_CODE_ALREADY_EXISTS = 'PROIVDER_PLAN_CODE_ALREADY_EXISTS',
}

export class ProviderPlanException extends BaseServiceException {
  constructor(message: string, errorCode: ProviderPlanErrorCodes, status: HttpStatus, cause?: Error) {
    super(message, errorCode, status, cause);
  }
}
