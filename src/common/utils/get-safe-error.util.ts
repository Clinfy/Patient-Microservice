import { HttpStatus } from '@nestjs/common';

export function getErrorStatus(error: unknown): HttpStatus {
  if (typeof error === 'object' && error !== null && 'status' in error && typeof error.status === 'number') {
    return error.status as HttpStatus;
  }

  return HttpStatus.INTERNAL_SERVER_ERROR;
}

export function getSafeError(error: unknown): Error | undefined {
  return error instanceof Error ? error : undefined;
}
