import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OutboxPublisherService } from 'src/cron/outbox-publisher.service';
import { OutboxCleanupService } from 'src/cron/outbox-cleanup.service';
import { OutboxSubscriberService } from 'src/cron/outbox.subscriber.service';

@Global()
@Module({
  imports: [
    //RabbitMQ Audit Service Module
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        inject: [ConfigService],
        name: 'AUDIT_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL') as string],
            queue: 'audit_queue',
            queueOptions: {
              durable: true,
            },
          },
        }),
      },
    ]),
  ],
  providers: [OutboxSubscriberService, OutboxPublisherService, OutboxCleanupService],
  exports: [OutboxSubscriberService, OutboxPublisherService, OutboxCleanupService],
})
export class CronModule {}
