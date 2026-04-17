import { IsNotEmpty, IsString } from 'class-validator';
import { IsUniqueCoverageProviderName } from 'src/common/validators/unique-coverage_provider-name.validator';

export class CreateCoverageProviderDto {
  @IsNotEmpty({ message: 'Provider name field is required' })
  @IsString({ message: 'Provider name must be a string' })
  @IsUniqueCoverageProviderName()
  provider_name: string;
}
