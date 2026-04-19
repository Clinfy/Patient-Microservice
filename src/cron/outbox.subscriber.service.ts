import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { JsonObject, JsonValue } from '@prisma/client/runtime/client';

export interface OutboxEvent {
  tx: Prisma.TransactionClient;
  pattern: 'entity_created' | 'entity_updated' | 'entity_deleted';
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
      action: this.generateAction(event),
      entity: event.entity,
      entity_id: event.entity_id,
      done_by: event.done_by,
    };
  }

  private generateAction(event: OutboxEvent): string {
    switch (event.pattern) {
      case 'entity_created':
        return event.entity.toUpperCase() + '_CREATED';
      case 'entity_updated':
        return event.entity.toUpperCase() + '_UPDATED';
      case 'entity_deleted':
        return event.entity.toUpperCase() + '_DELETED';
      default:
        return 'unknown';
    }
  }
}
