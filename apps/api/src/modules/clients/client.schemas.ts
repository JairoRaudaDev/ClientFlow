import { z } from 'zod';

const nameSchema = z
  .string()
  .trim()
  .min(2, 'Name must contain at least 2 characters')
  .max(120, 'Name must contain at most 120 characters');

const emptyStringToNull = (value: unknown): unknown =>
  typeof value === 'string' && value.trim() === '' ? null : value;

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

const searchSchema = z
  .string()
  .trim()
  .max(100, 'Search must contain at most 100 characters')
  .transform((value) => (value === '' ? undefined : value));

const pageSchema = z.coerce.number().int().min(1, 'Page must be at least 1');
const pageSizeSchema = z.coerce
  .number()
  .int()
  .min(1, 'Page size must be at least 1')
  .max(100, 'Page size must not exceed 100');
const sortFieldSchema = z.enum(['name', 'company', 'createdAt', 'updatedAt']);
const sortDirectionSchema = z.enum(['asc', 'desc']);

export const createClientBodySchema = z.strictObject({
  name: nameSchema,
  email: optionalEmailSchema.optional(),
  company: optionalCompanySchema.optional(),
  phone: optionalPhoneSchema.optional(),
  notes: optionalNotesSchema.optional(),
});

export const updateClientBodySchema = z
  .strictObject({
    name: nameSchema.optional(),
    email: optionalEmailSchema.optional(),
    company: optionalCompanySchema.optional(),
    phone: optionalPhoneSchema.optional(),
    notes: optionalNotesSchema.optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'Provide at least one field to update',
  });

export const clientIdParamsSchema = z.strictObject({
  clientId: z.uuid('Client identifier must be a valid UUID'),
});

export const clientListQuerySchema = z.strictObject({
  q: searchSchema.optional(),
  page: pageSchema.optional(),
  pageSize: pageSizeSchema.optional(),
  sortBy: sortFieldSchema.optional(),
  sortOrder: sortDirectionSchema.optional(),
});

export const clientSearchBodySchema = z.strictObject({
  search: searchSchema.optional(),
  filters: z
    .strictObject({
      hasEmail: z.boolean().optional(),
      hasPhone: z.boolean().optional(),
    })
    .optional(),
  sort: z
    .strictObject({
      field: sortFieldSchema.optional(),
      direction: sortDirectionSchema.optional(),
    })
    .optional(),
  pagination: z
    .strictObject({
      page: pageSchema.optional(),
      pageSize: pageSizeSchema.optional(),
    })
    .optional(),
});

export type CreateClientInput = z.infer<typeof createClientBodySchema>;
export type UpdateClientInput = z.infer<typeof updateClientBodySchema>;
export type ClientIdParams = z.infer<typeof clientIdParamsSchema>;
export type ClientListQuery = z.infer<typeof clientListQuerySchema>;
export type ClientSearchInput = z.infer<typeof clientSearchBodySchema>;
