import { Module } from '@nestjs/common';
import { ProviderPlanService } from './provider-plan.service';
import { ProviderPlanController } from './provider-plan.controller';
import { ProviderPlanRepository } from 'src/services/provider-plan/provider-plan.repository';
import { CoverageProviderModule } from 'src/services/coverage-provider/coverage-provider.module';

@Module({
  imports: [CoverageProviderModule],
  providers: [ProviderPlanService, ProviderPlanRepository],
  controllers: [ProviderPlanController],
})
export class ProviderPlanModule {}
