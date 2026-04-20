import { HttpStatus, Injectable } from '@nestjs/common';
import { ProviderPlanRepository } from 'src/services/provider-plan/provider-plan.repository';
import { RequestContextService } from 'src/common/context/request-context.service';
import { CoverageProviderService } from 'src/services/coverage-provider/coverage-provider.service';
import { CreateProviderPlanDto, UpdateProviderPlanDto } from 'src/interfaces/dto/provider-plan.dto';
import { ProviderPlan } from 'generated/prisma/client';
import { toPrismaJsonUser } from 'src/common/mappers/auth-user.mapper';
import { ProviderPlanErrorCodes, ProviderPlanException } from 'src/services/provider-plan/provider-plan.exception';
import { getErrorStatus, getSafeError } from 'src/common/utils/get-safe-error.util';
import {
  CoverageProviderErrorCodes,
  CoverageProviderException,
} from 'src/services/coverage-provider/coverage-provider.exception';
import { IProviderPlan } from 'src/interfaces/provider-plan.interface';
import { PaginatedResponseDto, PaginationQueryDto } from 'src/interfaces/dto/pagination.dto';

@Injectable()
export class ProviderPlanService {
  constructor(
    private readonly providerPlanRepository: ProviderPlanRepository,
    private readonly coverageProviderService: CoverageProviderService,
    private readonly contextService: RequestContextService,
  ) {}

  async create(dto: CreateProviderPlanDto): Promise<ProviderPlan> {
    if (!(await this.coverageProviderService.exists(dto.coverage_provider_id))) {
      throw new CoverageProviderException(
        'Coverage provider not found',
        CoverageProviderErrorCodes.COVERAGE_PROVIDER_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      return await this.providerPlanRepository.save({
        plan_name: dto.plan_name,
        plan_code: dto.plan_code,
        coverage_provider: { connect: { id: dto.coverage_provider_id } },
        created_by: toPrismaJsonUser(this.contextService.getCurrentUser()),
      });
    } catch (error) {
      throw new ProviderPlanException(
        'Failed to create provider plan',
        ProviderPlanErrorCodes.PROVIDER_PLAN_CREATION_FAILED,
        getErrorStatus(error),
        getSafeError(error),
      );
    }
  }

  async update(id: string, dto: UpdateProviderPlanDto): Promise<ProviderPlan> {
    if (!(await this.exists(id))) {
      throw new ProviderPlanException(
        `Provider plan with id ${id} not found`,
        ProviderPlanErrorCodes.PROVIDER_PLAN_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      return await this.providerPlanRepository.update(id, {
        ...dto,
        updated_by: toPrismaJsonUser(this.contextService.getCurrentUser()),
      });
    } catch (error) {
      throw new ProviderPlanException(
        'Failed to update provider plan',
        ProviderPlanErrorCodes.PROVIDER_PLAN_UPDATE_FAILED,
        getErrorStatus(error),
        getSafeError(error),
      );
    }
  }

  async delete(id: string): Promise<{ message: string }> {
    if (!(await this.exists(id))) {
      throw new ProviderPlanException(
        `Provider plan with id ${id} not found`,
        ProviderPlanErrorCodes.PROVIDER_PLAN_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    try {
      const plan = await this.providerPlanRepository.delete(id);
      return { message: `Provider plan with id ${plan.id} deleted successfully` };
    } catch (error) {
      throw new ProviderPlanException(
        'Failed to delete provider plan',
        ProviderPlanErrorCodes.PROVIDER_PLAN_DELETION_FAILED,
        getErrorStatus(error),
        getSafeError(error),
      );
    }
  }

  async exists(id: string): Promise<boolean> {
    return await this.providerPlanRepository.exists(id);
  }

  async findDetailsByProvider(providerId: string): Promise<IProviderPlan[]> {
    if (!(await this.coverageProviderService.exists(providerId))) {
      throw new CoverageProviderException(
        'Coverage provider not found',
        CoverageProviderErrorCodes.COVERAGE_PROVIDER_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      return await this.providerPlanRepository.findAllByProviderForDetails(providerId);
    } catch (error) {
      throw new ProviderPlanException(
        'Failed to search provider plans details',
        ProviderPlanErrorCodes.PROVIDER_PLAN_SEARCH_FAILED,
        getErrorStatus(error),
        getSafeError(error),
      );
    }
  }

  async findOneById(id: string): Promise<ProviderPlan> {
    const plan = await this.providerPlanRepository.findOneById(id);
    if (plan) return plan;

    throw new ProviderPlanException(
      `Provider plan with id ${id} not found`,
      ProviderPlanErrorCodes.PROVIDER_PLAN_NOT_FOUND,
      HttpStatus.NOT_FOUND,
    );
  }

  async findAllByProviderId(
    providerId: string,
    query: PaginationQueryDto = new PaginationQueryDto(),
  ): Promise<PaginatedResponseDto<ProviderPlan>> {
    if (!(await this.coverageProviderService.exists(providerId))) {
      throw new CoverageProviderException(
        'Coverage provider not found',
        CoverageProviderErrorCodes.COVERAGE_PROVIDER_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      return await this.providerPlanRepository.findAllByProviderId(providerId, query);
    } catch (error) {
      throw new ProviderPlanException(
        'Failed to search provider plans',
        ProviderPlanErrorCodes.PROVIDER_PLAN_SEARCH_FAILED,
        getErrorStatus(error),
        getSafeError(error),
      );
    }
  }
}
