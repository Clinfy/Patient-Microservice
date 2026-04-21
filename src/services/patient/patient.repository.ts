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
    return await this.prisma.$transaction(async (tx) => {
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

  async update(id: string, data: Prisma.PatientUpdateInput): Promise<Patient> {
    return await this.prisma.$transaction(async (tx) => {
      const patient = await tx.patient.update({ where: { id }, data });

      await this.outboxSubscriberService.handleOutboxEvent({
        tx: tx,
        pattern: 'entity_updated',
        entity: this.entity,
        entity_id: patient.id,
        done_by: patient.updated_by,
      });

      return patient;
    });
  }

  async delete(id: string): Promise<Patient> {
    return await this.prisma.$transaction(async (tx) => {
      const patient = await tx.patient.delete({ where: { id } });

      await this.outboxSubscriberService.handleOutboxEvent({
        tx: tx,
        pattern: 'entity_deleted',
        entity: this.entity,
        entity_id: patient.id,
      });

      return patient;
    });
  }

  async exists(id: string): Promise<boolean> {
    return (await this.prisma.patient.count({ where: { id } })) > 0;
  }
}
