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
