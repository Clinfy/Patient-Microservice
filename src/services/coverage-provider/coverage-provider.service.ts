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

@Injectable()
export class CoverageProviderService {
  constructor(
    private readonly coverageProviderRepository: CoverageProviderRepository,
    private readonly contextService: RequestContextService,
  ) {}

  async create(dto: CreateCoverageProviderDto): Promise<CoverageProvider> {
    return this.coverageProviderRepository.save({
      ...dto,
      created_by: toPrismaJsonUser(this.contextService.getCurrentUser()),
    });
  }

  async update(id: string, dto: CreateCoverageProviderDto): Promise<CoverageProvider> {
    return this.coverageProviderRepository.update(id, {
      ...dto,
      updated_by: toPrismaJsonUser(this.contextService.getCurrentUser()),
    });
  }

  async delete(id: string): Promise<{ message: string }> {
    const provider = await this.coverageProviderRepository.delete(id);
    return { message: `Coverage provider ${provider.provider_name} deleted successfully` };
  }

  async deactivateCoverage(id: string): Promise<CoverageProvider> {
    return this.coverageProviderRepository.update(id, {
      is_active: false,
      updated_by: toPrismaJsonUser(this.contextService.getCurrentUser()),
    });
  }

  async activateCoverage(id: string): Promise<CoverageProvider> {
    return this.coverageProviderRepository.update(id, {
      is_active: true,
      updated_by: toPrismaJsonUser(this.contextService.getCurrentUser()),
    });
  }

  async findAllForDetails(): Promise<ICoverageProvider[]> {
    return this.coverageProviderRepository.findAllForDetails();
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
    return this.coverageProviderRepository.findAll(query);
  }
}
