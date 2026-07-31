import { z } from 'zod';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidClientId(value: string): boolean {
  return UUID_REGEX.test(value);
}

const emptyStringToNull = (value: unknown): unknown =>
  typeof value === 'string' && value.trim() === '' ? null : value;

const nameSchema = z
  .string()
  .trim()
  .min(2, 'Name must contain at least 2 characters')
  .max(120, 'Name must contain at most 120 characters');

const optionalEmailSchema = z.preprocess(
  emptyStringToNull,
  z
    .string()
    .trim()
    .max(254, 'Email must contain at most 254 characters')
    .pipe(z.email('Enter a valid email address'))
    .transform((email) => email.toLowerCase())
    .nullable(),
);

const optionalCompanySchema = z.preprocess(
  emptyStringToNull,
  z.string().trim().max(120, 'Company must contain at most 120 characters').nullable(),
);

const optionalPhoneSchema = z.preprocess(
  emptyStringToNull,
  z.string().trim().max(32, 'Phone must contain at most 32 characters').nullable(),
);

const optionalNotesSchema = z.preprocess(
  emptyStringToNull,
  z.string().trim().max(2_000, 'Notes must contain at most 2000 characters').nullable(),
);

export const clientFormSchema = z.object({
  name: nameSchema,
  email: optionalEmailSchema,
  company: optionalCompanySchema,
  phone: optionalPhoneSchema,
  notes: optionalNotesSchema,
});

export type NormalizedClientInput = z.infer<typeof clientFormSchema>;
