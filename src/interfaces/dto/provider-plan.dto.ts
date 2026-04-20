import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { IsUniqueProviderPlanName } from 'src/common/validators/unique-provider_plan-name.validator';
import { IsUniqueProviderPlanCode } from 'src/common/validators/unique-provider_plan-code.validator';

export class CreateProviderPlanDto {
  @IsString({ message: 'Plan name must be a string' })
  @IsNotEmpty({ message: 'Plan name field is required' })
  @IsUniqueProviderPlanName()
  plan_name: string;

  @IsString({ message: 'Plan code must be a string' })
  @IsOptional()
  @IsUniqueProviderPlanCode()
  plan_code?: string;

  @IsUUID('7', { message: 'Coverage provider id must be a valid UUID' })
  @IsNotEmpty({ message: 'Coverage provider id field is required' })
  coverage_provider_id: string;
}
