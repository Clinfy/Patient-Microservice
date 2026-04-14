import { Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';

export function extractAuthToken(request: Request): string {
  const cookies = request.cookies as Record<string, string | undefined>;
  const cookie = cookies?.['auth_token'];
  if (cookie) return cookie;

  const authorization = request.headers['authorization'];
  if (authorization?.startsWith('Bearer ')) {
    return authorization.slice(7);
  }

  throw new UnauthorizedException('Authentication cookie is missing, expired, or invalid.');
}
