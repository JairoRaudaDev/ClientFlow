import 'dotenv/config';

import { z } from 'zod';

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

const environmentSchema = z.object({
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
});
