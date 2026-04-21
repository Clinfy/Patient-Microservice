import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Prisma, Patient } from 'generated/prisma/client';
import { OutboxSubscriberService } from 'src/cron/outbox.subscriber.service';

@Injectable()
export class PatientRepository {
  private readonly entity = 'patient';

  constructor(
    private readonly prisma: PrismaService,
    private readonly outboxSubscriberService: OutboxSubscriberService,
  ) {}

  async save(data: Prisma.PatientCreateInput): Promise<Patient> {
    return this.prisma.$transaction(async (tx) => {
      const patient = await tx.patient.create({ data });

      await this.outboxSubscriberService.handleOutboxEvent({
        tx: tx,
        pattern: 'entity_created',
        entity: this.entity,
        entity_id: patient.id,
        done_by: patient.created_by,
      });

      return patient;
    });
  }
}
