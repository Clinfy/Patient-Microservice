import { Body, Controller, Post } from '@nestjs/common';
import { ProviderPlan } from 'generated/prisma/client';
import { ProviderPlanService } from 'src/services/provider-plan/provider-plan.service';
import { CreateProviderPlanDto } from 'src/interfaces/dto/provider-plan.dto';

@Controller('provider-plan')
export class ProviderPlanController {
  constructor(private readonly providerPlanService: ProviderPlanService) {}

  @Post('new')
  createProviderPlan(@Body() providerPlanDto: CreateProviderPlanDto): Promise<ProviderPlan> {
    return this.providerPlanService.create(providerPlanDto);
  }
}
