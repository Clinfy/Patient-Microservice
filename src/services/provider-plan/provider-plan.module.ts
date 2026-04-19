import { Module } from '@nestjs/common';
import { ProviderPlanService } from './provider-plan.service';
import { ProviderPlanController } from './provider-plan.controller';
import { ProviderPlanRepository } from 'src/services/provider-plan/provider-plan.repository';

@Module({
  providers: [ProviderPlanService, ProviderPlanRepository],
  controllers: [ProviderPlanController],
})
export class ProviderPlanModule {}
