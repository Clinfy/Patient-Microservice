import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateProviderPlanDto {
  @IsString({ message: 'Plan name must be a string' })
  @IsNotEmpty({ message: 'Plan name field is required' })
  plan_name: string;

  @IsString({ message: 'Plan code must be a string' })
  @IsOptional()
  plan_code?: string;

  @IsUUID('7', { message: 'Coverage provider id must be a valid UUID' })
  @IsNotEmpty({ message: 'Coverage provider id field is required' })
  coverage_provider_id: string;
}
