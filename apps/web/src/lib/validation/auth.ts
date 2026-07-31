import { z } from 'zod';

const nameSchema = z
  .string()
  .trim()
  .min(2, 'Name must contain at least 2 characters')
  .max(100, 'Name must contain at most 100 characters');

const emailSchema = z
  .string()
  .trim()
  .min(1, 'Email is required')
  .max(254, 'Email must contain at most 254 characters')
  .pipe(z.email('Enter a valid email address'))
  .transform((email) => email.toLowerCase());

const passwordSchema = z
  .string()
  .min(8, 'Password must contain at least 8 characters')
  .max(128, 'Password must contain at most 128 characters');

const optionalWorkspaceNameSchema = z.preprocess(
  (value) => (typeof value === 'string' && value.trim().length === 0 ? undefined : value),
  z
    .string()
    .trim()
    .min(2, 'Workspace name must contain at least 2 characters')
    .max(100, 'Workspace name must contain at most 100 characters')
    .optional(),
);

export const registerSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    workspaceName: optionalWorkspaceNameSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required').max(128, 'Enter a valid password'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
