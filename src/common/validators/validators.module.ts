import { Global, Module } from '@nestjs/common';
import { IsUniqueCoverageProviderNameConstraint } from 'src/common/validators/unique-coverage_provider-name.validator';
import { IsUniqueProviderPlanNameConstraint } from 'src/common/validators/unique-provider_plan-name.validator';
import { IsUniqueProviderPlanCodeConstraint } from 'src/common/validators/unique-provider_plan-code.validator';

@Global()
@Module({
  providers: [
    IsUniqueCoverageProviderNameConstraint,
    IsUniqueProviderPlanNameConstraint,
    IsUniqueProviderPlanCodeConstraint,
  ],
  exports: [IsUniqueCoverageProviderNameConstraint, IsUniqueProviderPlanNameConstraint, IsUniqueProviderPlanCodeConstraint],
})
export class ValidatorsModule {}
