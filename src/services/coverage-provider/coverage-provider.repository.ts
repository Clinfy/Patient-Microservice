import { PrismaService } from 'src/common/prisma/prisma.service';
import { Prisma, CoverageProvider } from 'generated/prisma/client';
import { Injectable } from '@nestjs/common';
import { PaginatedResponseDto, PaginationQueryDto } from 'src/interfaces/dto/pagination.dto';
import { ICoverageProvider } from 'src/interfaces/coverage-provider.interface';
import { OutboxSubscriberService } from 'src/cron/outbox.subscriber.service';

@Injectable()
export class CoverageProviderRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly outboxSubscriberService: OutboxSubscriberService,
  ) {}

  async save(data: Prisma.CoverageProviderCreateInput): Promise<CoverageProvider> {
    return this.prisma.$transaction(async (tx) => {
      const coverageProvider = await tx.coverageProvider.create({ data });

      await this.outboxSubscriberService.handleOutboxEvent({
        tx: tx,
        pattern: 'entity_created',
        entity: 'coverage_provider',
        entity_id: coverageProvider.id,
        done_by: coverageProvider.created_by,
      });

      return coverageProvider;
    });
  }

  async update(id: string, data: Prisma.CoverageProviderUpdateInput): Promise<CoverageProvider> {
    return this.prisma.$transaction(async (tx) => {
      const coverageProvider = await tx.coverageProvider.update({ where: { id }, data });

      await this.outboxSubscriberService.handleOutboxEvent({
        tx: tx,
        pattern: 'entity_updated',
        entity: 'coverage_provider',
        entity_id: coverageProvider.id,
        done_by: coverageProvider.updated_by,
      });

      return coverageProvider;
    });
  }

  async delete(id: string): Promise<CoverageProvider> {
    return this.prisma.$transaction(async (tx) => {
      const coverageProvider = await tx.coverageProvider.delete({ where: { id } });

      await this.outboxSubscriberService.handleOutboxEvent({
        tx: tx,
        pattern: 'entity_deleted',
        entity: 'coverage_provider',
        entity_id: coverageProvider.id,
        done_by: coverageProvider.updated_by,
      });

      return coverageProvider;
    });
  }

  async findAllForDetails(): Promise<ICoverageProvider[]> {
    return this.prisma.coverageProvider.findMany({
      where: { is_active: true },
      select: { id: true, provider_name: true },
      orderBy: { provider_name: 'asc' },
    });
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
