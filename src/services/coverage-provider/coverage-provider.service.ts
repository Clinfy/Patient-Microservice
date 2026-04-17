import { Injectable } from '@nestjs/common';
import { CoverageProviderRepository } from 'src/services/coverage-provider/coverage-provider.repository';
import { CoverageProvider } from 'generated/prisma/client';
import { CreateCoverageProviderDto } from 'src/interfaces/dto/coverage-provider.dto';
import { RequestContextService } from 'src/common/context/request-context.service';
import { toPrismaJsonUser } from 'src/common/utils/auth-user-mapper.util';

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
}
