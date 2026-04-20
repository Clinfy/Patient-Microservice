import { Global, Module } from '@nestjs/common';
import { IsUniqueCoverageProviderNameConstraint } from 'src/common/validators/unique-coverage_provider-name.validator';
import { IsUniqueProviderPlanNameConstraint } from 'src/common/validators/unique-provider_plan-name.validator';

@Global()
@Module({
  providers: [IsUniqueCoverageProviderNameConstraint, IsUniqueProviderPlanNameConstraint],
  exports: [IsUniqueCoverageProviderNameConstraint, IsUniqueProviderPlanNameConstraint],
})
export class ValidatorsModule {}
