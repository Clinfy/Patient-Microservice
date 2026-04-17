import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CoverageProviderErrorCodes } from 'src/services/coverage-provider/coverage-provider.exception';

@ValidatorConstraint({ name: 'IsUniqueCoverageProviderName', async: true })
@Injectable()
export class IsUniqueCoverageProviderNameConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(value: string, args: ValidationArguments): Promise<boolean> {
    if (!value) return true;

    const ignoreIdField = (args.constraints?.[0]?.ignoreIdField as string) || 'id';
    const ignoreId = (args.object as Record<string, unknown>)?.[ignoreIdField] as string | undefined;

    const existingProvider = await this.prisma.coverageProvider.findFirst({
      where: {
        provider_name: value,
        ...(ignoreId ? { id: { not: ignoreId } } : {}),
      },
      select: {
        id: true,
      },
    });

    return !existingProvider;
  }

  defaultMessage(): string {
    return 'This provider name is already registered.';
  }
}

export function IsUniqueCoverageProviderName(options?: { ignoreIdField?: string }, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      constraints: [options || {}],
      options: {
        ...validationOptions,
        context: {
          errorCode: CoverageProviderErrorCodes.COVERAGE_PROVIDER_NAME_ALREADY_EXISTS,
          ...validationOptions?.context,
        },
      },
      validator: IsUniqueCoverageProviderNameConstraint,
    });
  };
}
