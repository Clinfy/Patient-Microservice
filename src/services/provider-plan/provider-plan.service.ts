import { Injectable } from '@nestjs/common';
import { ProviderPlanRepository } from 'src/services/provider-plan/provider-plan.repository';
import { RequestContextService } from 'src/common/context/request-context.service';
import { CoverageProviderService } from 'src/services/coverage-provider/coverage-provider.service';
import { CreateProviderPlanDto } from 'src/interfaces/dto/provider-plan.dto';
import { ProviderPlan } from 'generated/prisma/client';
import { toPrismaJsonUser } from 'src/common/mappers/auth-user.mapper';

@Injectable()
export class ProviderPlanService {
  constructor(
    private readonly providerPlanRepository: ProviderPlanRepository,
    private readonly coverageProviderService: CoverageProviderService,
    private readonly contextService: RequestContextService,
  ) {}

  async create(dto: CreateProviderPlanDto): Promise<ProviderPlan> {
    if (!(await this.coverageProviderService.exists(dto.coverage_provider_id))) {
      throw new Error('Coverage provider not found');
    }
    return this.providerPlanRepository.save({
      ...dto,
      coverage_provider: { connect: { id: dto.coverage_provider_id } },
      created_by: toPrismaJsonUser(this.contextService.getCurrentUser()),
    });
  }
}
