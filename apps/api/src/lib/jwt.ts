import type { AuthUser } from '@cms/shared';
import { SignJWT, jwtVerify } from 'jose';
import { env } from '../config/env.js';

const secret = new TextEncoder().encode(env.JWT_SECRET);

export interface Session {
  token: string;
  expiresAt: Date;
}

export async function createSessionToken(user: AuthUser): Promise<Session> {
  const expiresAt = new Date(Date.now() + env.AUTH_TOKEN_TTL_HOURS * 60 * 60 * 1000);

  const token = await new SignJWT({
    username: user.username,
    displayName: user.displayName,
    role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setSubject(String(user.id))
    .setIssuedAt()
    .setExpirationTime(Math.floor(expiresAt.getTime() / 1000))
    .sign(secret);

  return { token, expiresAt };
}

export async function verifySessionToken(token: string): Promise<AuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, secret);

    if (!payload.sub) {
      return null;
    }

    return {
      id: Number(payload.sub),
      username: String(payload['username'] ?? ''),
      displayName: String(payload['displayName'] ?? ''),
      role: String(payload['role'] ?? ''),
    };
  } catch {
    return null;
  }
}
