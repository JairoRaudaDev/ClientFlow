import { z } from 'zod';

const nameSchema = z
  .string()
  .trim()
  .min(2, 'Name must contain at least 2 characters')
  .max(100, 'Name must contain at most 100 characters');

const emailSchema = z
  .string()
  .trim()
  .max(254, 'Email must contain at most 254 characters')
  .pipe(z.email('Enter a valid email address'))
  .transform((email) => email.toLowerCase());

const passwordSchema = z
  .string()
  .min(8, 'Password must contain at least 8 characters')
  .max(128, 'Password must contain at most 128 characters');

const workspaceNameSchema = z
  .string()
  .trim()
  .min(2, 'Workspace name must contain at least 2 characters')
  .max(100, 'Workspace name must contain at most 100 characters');

export const registerBodySchema = z.strictObject({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  workspaceName: workspaceNameSchema.optional(),
});

export const loginBodySchema = z.strictObject({
  email: emailSchema,
  password: passwordSchema,
});

export type RegisterInput = z.infer<typeof registerBodySchema>;
export type LoginInput = z.infer<typeof loginBodySchema>;
