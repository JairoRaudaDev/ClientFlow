import 'dotenv/config';

import { z } from 'zod';

const developmentDatabaseUrl = 'postgresql://clientflow:clientflow@127.0.0.1:5432/clientflow';
const developmentJwtSecret = 'clientflow-local-development-secret-change-me';
const developmentSeedUserPassword = 'ClientFlowDemo123!';

const corsOriginSchema = z
  .url('must be a valid URL')
  .refine((origin) => ['http:', 'https:'].includes(new URL(origin).protocol), {
    message: 'must use the http or https protocol',
  })
  .refine(
    (origin) => {
      const parsedOrigin = new URL(origin);

      return (
        parsedOrigin.pathname === '/' &&
        parsedOrigin.search === '' &&
        parsedOrigin.hash === '' &&
        parsedOrigin.username === '' &&
        parsedOrigin.password === ''
      );
    },
    {
      message: 'must contain only a scheme, hostname, and optional port',
    },
  )
  .transform((origin) => new URL(origin).origin);

const databaseUrlSchema = z
  .url('must be a valid PostgreSQL connection string')
  .refine((databaseUrl) => ['postgres:', 'postgresql:'].includes(new URL(databaseUrl).protocol), {
    message: 'must use the postgres or postgresql protocol',
  });

const accessTokenTtlSchema = z
  .string()
  .trim()
  .regex(/^[1-9]\d*[smhd]$/, 'must be a positive duration such as 15m, 1h, or 7d');

const environmentSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    API_HOST: z.string().trim().min(1, 'must not be empty').default('0.0.0.0'),
    API_PORT: z.preprocess((value) => value ?? 4000, z.coerce.number().int().min(1).max(65_535)),
    CORS_ORIGIN: z
      .string()
      .trim()
      .min(1, 'must contain at least one origin')
      .default('http://localhost:3000')
      .transform((value) =>
        value
          .split(',')
          .map((origin) => origin.trim())
          .filter((origin) => origin.length > 0),
      )
      .pipe(z.array(corsOriginSchema).min(1, 'must contain at least one valid origin')),
    DATABASE_URL: databaseUrlSchema.optional(),
    JWT_SECRET: z.string().min(32, 'must contain at least 32 characters').optional(),
    JWT_ISSUER: z.string().trim().min(1, 'must not be empty').default('clientflow-api'),
    JWT_AUDIENCE: z.string().trim().min(1, 'must not be empty').default('clientflow-web'),
    JWT_ACCESS_TOKEN_TTL: accessTokenTtlSchema.default('1h'),
    SEED_USER_PASSWORD: z.string().min(8).max(128).optional(),
  })
  .superRefine((environment, context) => {
    if (environment.NODE_ENV !== 'development' && environment.DATABASE_URL === undefined) {
      context.addIssue({
        code: 'custom',
        path: ['DATABASE_URL'],
        message: `is required when NODE_ENV is ${environment.NODE_ENV}`,
      });
    }

    if (environment.NODE_ENV === 'production' && environment.JWT_SECRET === undefined) {
      context.addIssue({
        code: 'custom',
        path: ['JWT_SECRET'],
        message: 'is required when NODE_ENV is production',
      });
    }
  });

const parsedEnvironment = environmentSchema.safeParse(process.env);

if (!parsedEnvironment.success) {
  const details = parsedEnvironment.error.issues
    .map((issue) => {
      const variable = issue.path[0] ?? 'environment';

      return `${String(variable)}: ${issue.message}`;
    })
    .join('; ');

  throw new Error(`Invalid environment configuration: ${details}`);
}

export const env = Object.freeze({
  nodeEnv: parsedEnvironment.data.NODE_ENV,
  apiHost: parsedEnvironment.data.API_HOST,
  apiPort: parsedEnvironment.data.API_PORT,
  corsOrigins: parsedEnvironment.data.CORS_ORIGIN,
  databaseUrl: parsedEnvironment.data.DATABASE_URL ?? developmentDatabaseUrl,
  jwtSecret: parsedEnvironment.data.JWT_SECRET ?? developmentJwtSecret,
  jwtIssuer: parsedEnvironment.data.JWT_ISSUER,
  jwtAudience: parsedEnvironment.data.JWT_AUDIENCE,
  jwtAccessTokenTtl: parsedEnvironment.data.JWT_ACCESS_TOKEN_TTL,
  seedUserPassword:
    parsedEnvironment.data.SEED_USER_PASSWORD ??
    (parsedEnvironment.data.NODE_ENV === 'production' ? undefined : developmentSeedUserPassword),
});
