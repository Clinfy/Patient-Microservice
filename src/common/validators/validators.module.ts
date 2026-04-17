import { Global, Module } from '@nestjs/common';
import { IsUniqueCoverageProviderNameConstraint } from 'src/common/validators/unique-coverage_provider-name.validator';

@Global()
@Module({
  providers: [IsUniqueCoverageProviderNameConstraint],
  exports: [IsUniqueCoverageProviderNameConstraint],
})
export class ValidatorsModule {}
