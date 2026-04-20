import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Prisma, ProviderPlan } from 'generated/prisma/client';
import { OutboxSubscriberService } from 'src/cron/outbox.subscriber.service';
import { PaginatedResponseDto, PaginationQueryDto } from 'src/interfaces/dto/pagination.dto';
import { IProviderPlan } from 'src/interfaces/provider-plan.interface';

@Injectable()
export class ProviderPlanRepository {
  private readonly entity = 'provider_plan';
  constructor(
    private readonly prisma: PrismaService,
    private readonly outboxSubscriberService: OutboxSubscriberService,
  ) {}

  async save(data: Prisma.ProviderPlanCreateInput): Promise<ProviderPlan> {
    return this.prisma.$transaction(async (tx) => {
      const providerPlan = await tx.providerPlan.create({ data });

      await this.outboxSubscriberService.handleOutboxEvent({
        tx: tx,
        pattern: 'entity_created',
        entity: this.entity,
        entity_id: providerPlan.id,
        done_by: providerPlan.created_by,
      });

      return providerPlan;
    });
  }

  async update(id: string, data: Prisma.ProviderPlanUpdateInput): Promise<ProviderPlan> {
    return this.prisma.$transaction(async (tx) => {
      const providerPlan = await tx.providerPlan.update({ where: { id }, data });

      await this.outboxSubscriberService.handleOutboxEvent({
        tx: tx,
        pattern: 'entity_updated',
        entity: this.entity,
        entity_id: providerPlan.id,
        done_by: providerPlan.updated_by,
      });

      return providerPlan;
    });
  }

  async delete(id: string): Promise<ProviderPlan> {
    return this.prisma.$transaction(async (tx) => {
      const providerPlan = await tx.providerPlan.delete({ where: { id } });

      await this.outboxSubscriberService.handleOutboxEvent({
        tx: tx,
        pattern: 'entity_deleted',
        entity: this.entity,
        entity_id: providerPlan.id,
      });

      return providerPlan;
    });
  }

  async exists(id: string): Promise<boolean> {
    return (await this.prisma.providerPlan.count({ where: { id } })) > 0;
  }

  async findAllByProviderForDetails(providerId: string): Promise<IProviderPlan[]> {
    return this.prisma.providerPlan.findMany({
      where: { is_active: true, coverage_provider_id: providerId },
      select: { id: true, plan_name: true, plan_code: true },
      orderBy: [{ plan_name: 'asc' }, { id: 'asc' }],
    });
  }

  async findOneById(id: string): Promise<ProviderPlan | null> {
    return this.prisma.providerPlan.findUnique({ where: { id }, include: { coverage_provider: true } });
  }

  async findAllByProviderId(providerId: string, query: PaginationQueryDto): Promise<PaginatedResponseDto<ProviderPlan>> {
    const { page, limit } = query;
    const [data, total] = await this.prisma.$transaction([
      this.prisma.providerPlan.findMany({
        where: { coverage_provider_id: providerId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ plan_name: 'asc' }, { id: 'asc' }],
      }),
      this.prisma.providerPlan.count({ where: { coverage_provider_id: providerId } }),
    ]);
    return new PaginatedResponseDto(data, total, page, limit);
  }
}
