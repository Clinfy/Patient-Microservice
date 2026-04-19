import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { JsonObject, JsonValue } from '@prisma/client/runtime/client';

export interface OutboxEvent {
  tx: Prisma.TransactionClient;
  pattern: string;
  action: string;
  entity: string;
  entity_id: string;
  done_by?: JsonValue;
}

@Injectable()
export class OutboxSubscriberService {
  constructor() {}

  async handleOutboxEvent(event: OutboxEvent): Promise<void> {
    await event.tx.outbox.create({
      data: {
        pattern: event.pattern,
        destination: 'audit_queue',
        payload: this.generatePayload(event),
      },
    });
  }

  private generatePayload(event: OutboxEvent): JsonObject {
    return {
      action: event.action,
      entity: event.entity,
      entity_id: event.entity_id,
      done_by: event.done_by,
    };
  }
}
