import { HttpStatus, Injectable } from '@nestjs/common';
import { CoverageProviderRepository } from 'src/services/coverage-provider/coverage-provider.repository';
import { CoverageProvider } from 'generated/prisma/client';
import { CreateCoverageProviderDto } from 'src/interfaces/dto/coverage-provider.dto';
import { RequestContextService } from 'src/common/context/request-context.service';
import { toPrismaJsonUser } from 'src/common/mappers/auth-user.mapper';
import {
  CoverageProviderErrorCodes,
  CoverageProviderException,
} from 'src/services/coverage-provider/coverage-provider.exception';
import { PaginatedResponseDto, PaginationQueryDto } from 'src/interfaces/dto/pagination.dto';
import { ICoverageProvider } from 'src/interfaces/coverage-provider.interface';
import { getErrorStatus, getSafeError } from 'src/common/utils/get-safe-error.util';

@Injectable()
export class CoverageProviderService {
  constructor(
    private readonly coverageProviderRepository: CoverageProviderRepository,
    private readonly contextService: RequestContextService,
  ) {}

  async create(dto: CreateCoverageProviderDto): Promise<CoverageProvider> {
    try {
      return this.coverageProviderRepository.save({
        ...dto,
        created_by: toPrismaJsonUser(this.contextService.getCurrentUser()),
      });
    } catch (error) {
      throw new CoverageProviderException(
        'Failed to create coverage provider',
        CoverageProviderErrorCodes.COVERAGE_PROVIDER_CREATION_FAILED,
        getErrorStatus(error),
        getSafeError(error),
      );
    }
  }

  async update(id: string, dto: CreateCoverageProviderDto): Promise<CoverageProvider> {
    try {
      return this.coverageProviderRepository.update(id, {
        ...dto,
        updated_by: toPrismaJsonUser(this.contextService.getCurrentUser()),
      });
    } catch (error) {
      throw new CoverageProviderException(
        'Failed to update coverage provider',
        CoverageProviderErrorCodes.COVERAGE_PROVIDER_UPDATE_FAILED,
        getErrorStatus(error),
        getSafeError(error),
      );
    }
  }

  async delete(id: string): Promise<{ message: string }> {
    try {
      const provider = await this.coverageProviderRepository.delete(id);
      return { message: `Coverage provider ${provider.provider_name} deleted successfully` };
    } catch (error) {
      throw new CoverageProviderException(
        'Failed to delete coverage provider',
        CoverageProviderErrorCodes.COVERAGE_PROVIDER_DELETION_FAILED,
        getErrorStatus(error),
        getSafeError(error),
      );
    }
  }

  async exists(id: string): Promise<boolean> {
    return await this.coverageProviderRepository.exists(id);
  }

  async deactivateCoverage(id: string): Promise<CoverageProvider> {
    try {
      return this.coverageProviderRepository.update(id, {
        is_active: false,
        updated_by: toPrismaJsonUser(this.contextService.getCurrentUser()),
      });
    } catch (error) {
      throw new CoverageProviderException(
        'Failed to deactivate coverage provider',
        CoverageProviderErrorCodes.COVERAGE_PROVIDER_UPDATE_FAILED,
        getErrorStatus(error),
        getSafeError(error),
      );
    }
  }

  async activateCoverage(id: string): Promise<CoverageProvider> {
    try {
      return this.coverageProviderRepository.update(id, {
        is_active: true,
        updated_by: toPrismaJsonUser(this.contextService.getCurrentUser()),
      });
    } catch (error) {
      throw new CoverageProviderException(
        'Failed to activate coverage provider',
        CoverageProviderErrorCodes.COVERAGE_PROVIDER_UPDATE_FAILED,
        getErrorStatus(error),
        getSafeError(error),
      );
    }
  }

  async findAllForDetails(): Promise<ICoverageProvider[]> {
    try {
      return await this.coverageProviderRepository.findAllForDetails();
    } catch (error) {
      throw new CoverageProviderException(
        'Failed to search coverage providers details',
        CoverageProviderErrorCodes.COVERAGE_PROVIDER_SEARCH_FAILED,
        getErrorStatus(error),
        getSafeError(error),
      );
    }
  }

  async findOneById(id: string): Promise<CoverageProvider> {
    const provider = await this.coverageProviderRepository.findOneById(id);
    if (provider) return provider;

    throw new CoverageProviderException(
      `Coverage provider with id ${id} not found`,
      CoverageProviderErrorCodes.COVERAGE_PROVIDER_NOT_FOUND,
      HttpStatus.NOT_FOUND,
    );
  }

  async findAll(query: PaginationQueryDto = new PaginationQueryDto()): Promise<PaginatedResponseDto<CoverageProvider>> {
    try {
      return await this.coverageProviderRepository.findAll(query);
    } catch (error) {
      throw new CoverageProviderException(
        'Failed to search coverage providers',
        CoverageProviderErrorCodes.COVERAGE_PROVIDER_SEARCH_FAILED,
        getErrorStatus(error),
        getSafeError(error),
      );
    }
  }
}
