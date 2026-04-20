import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ProviderPlanErrorCodes } from 'src/services/provider-plan/provider-plan.exception';

@ValidatorConstraint({ name: 'IsUniqueProviderPlanCode', async: true })
@Injectable()
export class IsUniqueProviderPlanCodeConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(planCode: string, args: ValidationArguments): Promise<boolean> {
    if (!planCode) return true;

    const object = args.object as Record<string, unknown>;

    const coverageProviderId = object['coverage_provider_id'] as string | undefined;
    if (!coverageProviderId) return true;

    const ignoreIdField = (args.constraints?.[0]?.ignoreIdField as string) || 'id';
    const ignoreId = object[ignoreIdField] as string | undefined;

    const existingPlan = await this.prisma.providerPlan.findFirst({
      where: {
        coverage_provider_id: coverageProviderId,
        plan_code: planCode,
        ...(ignoreId ? { id: { not: ignoreId } } : {}),
      },
      select: {
        id: true,
      },
    });

    return !existingPlan;
  }

  defaultMessage(): string {
    return 'This plan code is already registered for the selected coverage provider.';
  }
}

export function IsUniqueProviderPlanCode(options?: { ignoreIdField?: string }, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      constraints: [options || {}],
      options: {
        ...validationOptions,
        context: {
          errorCode: ProviderPlanErrorCodes.PROVIDER_PLAN_CODE_ALREADY_EXISTS,
          ...validationOptions?.context,
        },
      },
      validator: IsUniqueProviderPlanCodeConstraint,
    });
  };
}
