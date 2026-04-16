import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Cron, CronExpression } from '@nestjs/schedule';
import { serializeError } from 'src/common/utils/logger-format.util';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { OutboxStatus } from '../../generated/prisma/enums';

@Injectable()
export class OutboxCleanupService {
  constructor(
    private readonly prisma: PrismaService,

    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  private async handleOutboxCleanup(): Promise<void> {
    this.logger.info('Cleaning up sent outbox messages started', {
      context: 'OutboxCleanupService',
      operation: 'cleanSentOutboxMessages',
    });

    const BATCH_SIZE = 1000;
    let totalDeleted = 0;
    let affected = 0;

    try {
      do {
        const result = await this.prisma.outbox.deleteMany({
          where: { status: OutboxStatus.SENT },
          limit: BATCH_SIZE,
        });

        affected = result.count;
        totalDeleted += affected;

        this.logger.info(`Deleted ${affected} outbox messages`, {
          context: 'OutboxCleanupService',
          operation: 'cleanSentOutboxMessages',
        });
      } while (affected === BATCH_SIZE);

      this.logger.info('Cleaning up sent outbox messages completed', {
        context: 'OutboxCleanupService',
        operation: 'cleanSentOutboxMessages',
        totalDeleted,
      });
    } catch (error) {
      this.logger.error('Failed to clean up sent outbox messages', {
        context: 'OutboxCleanupService',
        operation: 'cleanSentOutboxMessages',
        error: serializeError(error),
      });
    }
  }
}
