import { randomUUID } from 'node:crypto';

import { errors, jwtVerify, SignJWT } from 'jose';

import { env } from '../config/env.js';

const accessTokenAlgorithm = 'HS256';
const accessTokenType = 'access';
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const secret = new TextEncoder().encode(env.jwtSecret);

export interface VerifiedAccessToken {
  userId: string;
}

export class AccessTokenExpiredError extends Error {
  constructor() {
    super('The access token has expired');
    this.name = 'AccessTokenExpiredError';
  }
}

export class InvalidAccessTokenError extends Error {
  constructor() {
    super('The access token is invalid');
    this.name = 'InvalidAccessTokenError';
  }
}

export async function createAccessToken(userId: string): Promise<string> {
  return new SignJWT({ tokenType: accessTokenType })
    .setProtectedHeader({ alg: accessTokenAlgorithm, typ: 'JWT' })
    .setSubject(userId)
    .setIssuer(env.jwtIssuer)
    .setAudience(env.jwtAudience)
    .setIssuedAt()
    .setExpirationTime(env.jwtAccessTokenTtl)
    .setJti(randomUUID())
    .sign(secret);
}

export async function verifyAccessToken(token: string): Promise<VerifiedAccessToken> {
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: [accessTokenAlgorithm],
      issuer: env.jwtIssuer,
      audience: env.jwtAudience,
    });

    if (
      typeof payload.sub !== 'string' ||
      !uuidPattern.test(payload.sub) ||
      typeof payload.iat !== 'number' ||
      typeof payload.exp !== 'number' ||
      typeof payload.jti !== 'string' ||
      payload.jti.length === 0 ||
      payload.tokenType !== accessTokenType
    ) {
      throw new InvalidAccessTokenError();
    }

    return { userId: payload.sub };
  } catch (error) {
    if (error instanceof AccessTokenExpiredError || error instanceof InvalidAccessTokenError) {
      throw error;
    }

    if (error instanceof errors.JWTExpired) {
      throw new AccessTokenExpiredError();
    }

    throw new InvalidAccessTokenError();
  }
}
