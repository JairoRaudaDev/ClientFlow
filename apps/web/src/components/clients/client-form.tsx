'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';

import { AuthFormError } from '@/components/auth/auth-form-error';
import { FormField } from '@/components/auth/form-field';
import { ApiRequestError } from '@/lib/api/errors';
import { clientFormSchema } from '@/lib/clients/client-validation';
import type { NormalizedClientInput } from '@/lib/clients/client-validation';

export interface ClientFormValues {
  name: string;
  email: string;
  company: string;
  phone: string;
  notes: string;
}

const FIELD_KEYS: (keyof ClientFormValues)[] = ['name', 'email', 'company', 'phone', 'notes'];

type FieldErrors = Partial<Record<keyof ClientFormValues, string>>;

interface ClientFormProps {
  mode: 'create' | 'edit';
  initialValues: ClientFormValues;
  onSubmit: (values: NormalizedClientInput) => Promise<void>;
  submitLabel: string;
}

export function ClientForm({ mode, initialValues, onSubmit, submitLabel }: ClientFormProps) {
  const [values, setValues] = useState<ClientFormValues>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: keyof ClientFormValues, value: string) {
    setValues((previous) => ({ ...previous, [field]: value }));
    setFieldErrors((previous) => {
      if (previous[field] === undefined) {
        return previous;
      }

      const next = { ...previous };
      delete next[field];
      return next;
    });
    setFormError(undefined);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setFormError(undefined);

    const result = clientFormSchema.safeParse(values);

    if (!result.success) {
      const nextFieldErrors: FieldErrors = {};

      for (const issue of result.error.issues) {
        const field = issue.path[0];

        if (typeof field === 'string' && !(field in nextFieldErrors)) {
          nextFieldErrors[field as keyof ClientFormValues] = issue.message;
        }
      }

      setFieldErrors(nextFieldErrors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      await onSubmit(result.data);
    } catch (error) {
      setIsSubmitting(false);

      if (error instanceof ApiRequestError) {
        if (error.code === 'VALIDATION_ERROR' && error.details !== undefined) {
          const nextFieldErrors: FieldErrors = {};
          const unknownMessages: string[] = [];

          for (const detail of error.details) {
            if ((FIELD_KEYS as string[]).includes(detail.field)) {
              nextFieldErrors[detail.field as keyof ClientFormValues] = detail.message;
            } else {
              unknownMessages.push(detail.message);
            }
          }

          setFieldErrors(nextFieldErrors);

          if (unknownMessages.length > 0) {
            setFormError(unknownMessages.join(' '));
          }
          return;
        }

        setFormError(error.message);
        return;
      }

      setFormError('Something went wrong. Please try again.');
    }
  }

  return (
    <form
      data-mode={mode}
      onSubmit={(event) => void handleSubmit(event)}
      noValidate
      aria-busy={isSubmitting}
      className="space-y-5"
    >
      {formError !== undefined ? <AuthFormError message={formError} /> : null}

      <FormField
        id="client-name"
        name="name"
        label="Name"
        type="text"
        autoComplete="name"
        required
        minLength={2}
        maxLength={120}
        value={values.name}
        onChange={(event) => updateField('name', event.target.value)}
        error={fieldErrors.name}
        disabled={isSubmitting}
      />

      <FormField
        id="client-email"
        name="email"
        label="Email"
        description="Optional"
        type="email"
        autoComplete="email"
        maxLength={254}
        value={values.email}
        onChange={(event) => updateField('email', event.target.value)}
        error={fieldErrors.email}
        disabled={isSubmitting}
      />

      <FormField
        id="client-company"
        name="company"
        label="Company"
        description="Optional"
        type="text"
        autoComplete="organization"
        maxLength={120}
        value={values.company}
        onChange={(event) => updateField('company', event.target.value)}
        error={fieldErrors.company}
        disabled={isSubmitting}
      />

      <FormField
        id="client-phone"
        name="phone"
        label="Phone"
        description="Optional"
        type="tel"
        autoComplete="tel"
        maxLength={32}
        value={values.phone}
        onChange={(event) => updateField('phone', event.target.value)}
        error={fieldErrors.phone}
        disabled={isSubmitting}
      />

      <div className="space-y-1.5">
        <label htmlFor="client-notes" className="text-foreground block text-sm font-medium">
          Notes
        </label>
        <p id="client-notes-description" className="text-muted text-xs">
          Optional
        </p>
        <textarea
          id="client-notes"
          name="notes"
          rows={5}
          maxLength={2000}
          value={values.notes}
          onChange={(event) => updateField('notes', event.target.value)}
          aria-invalid={fieldErrors.notes !== undefined}
          aria-describedby={
            [
              'client-notes-description',
              fieldErrors.notes !== undefined ? 'client-notes-error' : undefined,
            ]
              .filter(Boolean)
              .join(' ') || undefined
          }
          disabled={isSubmitting}
          className="border-border bg-surface text-foreground placeholder:text-muted focus-visible:ring-accent w-full resize-y rounded-md border px-3 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
        />
        {fieldErrors.notes !== undefined ? (
          <p id="client-notes-error" className="text-sm font-medium text-red-600">
            {fieldErrors.notes}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-accent text-accent-foreground focus-visible:ring-accent inline-flex w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-indigo-700 focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        <span aria-live="polite">{isSubmitting ? 'Saving...' : submitLabel}</span>
      </button>
    </form>
  );
}
