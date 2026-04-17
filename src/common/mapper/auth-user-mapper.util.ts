import { Prisma } from '../../../generated/prisma/client';
import { AuthUser } from 'src/clients/auth/auth-client.interface';

export function toPrismaJsonUser(user: AuthUser | null): Prisma.InputJsonValue | typeof Prisma.DbNull {
  if (!user) return Prisma.DbNull;

  return {
    id: user.id,
    person_id: user.person_id,
    email: user.email,
    session_id: user.session_id,
  };
}
