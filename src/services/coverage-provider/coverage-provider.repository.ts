import { PrismaService } from 'src/common/prisma/prisma.service';
import { Prisma, CoverageProvider } from 'generated/prisma/client';
import { Injectable } from '@nestjs/common';
import { PaginatedResponseDto, PaginationQueryDto } from 'src/interfaces/dto/pagination.dto';

@Injectable()
export class CoverageProviderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(data: Prisma.CoverageProviderCreateInput): Promise<CoverageProvider> {
    const saved: CoverageProvider = await this.prisma.coverageProvider.create({ data });
    await this.prisma.outbox.create({
      data: {
        pattern: 'coverage_created',
        destination: 'audit_queue',
        payload: {
          action: 'COVERAGE_PROVIDER_CREATED',
          entity: 'coverage_provider',
          coverageProviderId: saved.id,
          done_by: saved.created_by ?? null,
          timestamp: new Date().toISOString(),
        },
      },
    });
    return saved;
  }

  async update(id: string, data: Prisma.CoverageProviderUpdateInput): Promise<CoverageProvider> {
    return this.prisma.coverageProvider.update({ where: { id }, data });
  }

  async delete(id: string): Promise<CoverageProvider> {
    return this.prisma.coverageProvider.delete({ where: { id } });
  }

  async findOneById(id: string): Promise<CoverageProvider | null> {
    return this.prisma.coverageProvider.findUnique({ where: { id } });
  }

  async findAll(query: PaginationQueryDto): Promise<PaginatedResponseDto<CoverageProvider>> {
    const { page, limit } = query;
    const [data, total] = await this.prisma.$transaction([
      this.prisma.coverageProvider.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { provider_name: 'asc' },
      }),
      this.prisma.coverageProvider.count(),
    ]);
    return new PaginatedResponseDto(data, total, page, limit);
  }
}
