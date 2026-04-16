import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Cron, CronExpression } from '@nestjs/schedule';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { lastValueFrom } from 'rxjs';
import { serializeError } from 'src/common/utils/logger-format.util';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Outbox, OutboxStatus } from '../../generated/prisma/client';

@Injectable()
export class OutboxPublisherService implements OnModuleInit {
  private static readonly BATCH_SIZE = 100;
  private static readonly PROCESSING_TIMEOUT_MS = 60_000;
  private static readonly MAX_RETRIES = 5;

  constructor(
    private readonly prisma: PrismaService,

    @Inject('AUDIT_SERVICE')
    private readonly auditClient: ClientProxy,

    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.auditClient.connect();
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  private async handleAuditEvents(): Promise<void> {
    const claimedEvents = await this.claimAvailableEvents();

    for (const event of claimedEvents) {
      try {
        await lastValueFrom(this.auditClient.emit(event.pattern, event.payload));

        await this.prisma.outbox.update({
          where: { id: event.id },
          data: {
            status: OutboxStatus.SENT,
            claimed_at: null,
          },
        });
      } catch (error) {
        const nextRetryCount = event.retry_count + 1;
        const isFailed = nextRetryCount >= OutboxPublisherService.MAX_RETRIES;
        const lastError = String(error?.message ?? error).slice(0, 500);

        await this.prisma.outbox.update({
          where: { id: event.id },
          data: {
            status: isFailed ? OutboxStatus.FAILED : OutboxStatus.PENDING,
            claimed_at: null,
            retry_count: nextRetryCount,
            last_error: lastError,
          },
        });

        this.logger.warn('Error publishing event', {
          context: 'OutboxPublisherService',
          operation: 'handleAuditEvents',
          eventId: event.id,
          pattern: event.pattern,
          retryCount: nextRetryCount,
          isFailed,
          error: serializeError(error),
        });
      }
    }
  }

  private async claimAvailableEvents(): Promise<Outbox[]> {
    return this.prisma.$transaction(async (tx) => {
      const now = new Date();
      const staleBefore = new Date(now.getTime() - OutboxPublisherService.PROCESSING_TIMEOUT_MS);
      const batchSize = OutboxPublisherService.BATCH_SIZE;

      // FOR UPDATE SKIP LOCKED ensures concurrent workers don't claim the same rows.
      // FAILED rows are intentionally excluded: they exceeded MAX_RETRIES
      // and are left for manual review. Only PENDING and stale PROCESSING
      // rows (stuck beyond PROCESSING_TIMEOUT_MS) are eligible for claiming.
      const events = await tx.$queryRaw<Outbox[]>`
        SELECT * FROM outbox
        WHERE destination = 'audit_queue'
        AND (
          status = 'PENDING'
          OR (
            status = 'PROCESSING'
            AND claimed_at IS NOT NULL
            AND claimed_at < ${staleBefore}
          )
        )
        ORDER BY created_at ASC, id ASC
        LIMIT ${batchSize}
        FOR UPDATE SKIP LOCKED
      `;

      if (events.length === 0) {
        return [];
      }

      const ids = events.map((event) => event.id);

      await tx.outbox.updateMany({
        where: { id: { in: ids } },
        data: {
          status: OutboxStatus.PROCESSING,
          claimed_at: now,
        },
      });

      return events.map((event) => ({
        ...event,
        status: OutboxStatus.PROCESSING,
        claimed_at: now,
      }));
    });
  }
}
