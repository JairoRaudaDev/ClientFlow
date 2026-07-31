'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { login } from '@/lib/api/auth';
import { ApiRequestError } from '@/lib/api/errors';
import { saveAccessToken } from '@/lib/auth/token-storage';
import { loginSchema } from '@/lib/validation/auth';

import { AuthFormError } from './auth-form-error';
import { FormField } from './form-field';

interface FormValues {
  email: string;
  password: string;
}

const initialValues: FormValues = {
  email: '',
  password: '',
};

type FieldErrors = Partial<Record<keyof FormValues, string>>;

export function LoginForm() {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: keyof FormValues, value: string) {
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setFormError(undefined);

    const result = loginSchema.safeParse(values);

    if (!result.success) {
      const nextFieldErrors: FieldErrors = {};

      for (const issue of result.error.issues) {
        const field = issue.path[0];

        if (typeof field === 'string' && !(field in nextFieldErrors)) {
          nextFieldErrors[field as keyof FormValues] = issue.message;
        }
      }

      setFieldErrors(nextFieldErrors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const data = await login(result.data);

      saveAccessToken(data.accessToken);
      router.replace('/dashboard');
    } catch (error) {
      setIsSubmitting(false);

      if (error instanceof ApiRequestError) {
        if (error.code === 'INVALID_CREDENTIALS') {
          setFormError('The email or password is incorrect.');
          return;
        }

        if (error.code === 'VALIDATION_ERROR' && error.details !== undefined) {
          const nextFieldErrors: FieldErrors = {};
          const unknownMessages: string[] = [];

          for (const detail of error.details) {
            if (detail.field in initialValues) {
              nextFieldErrors[detail.field as keyof FormValues] = detail.message;
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
      onSubmit={(event) => void handleSubmit(event)}
      noValidate
      aria-busy={isSubmitting}
      className="space-y-5"
    >
      {formError !== undefined ? <AuthFormError message={formError} /> : null}

      <FormField
        id="email"
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        required
        maxLength={254}
        value={values.email}
        onChange={(event) => updateField('email', event.target.value)}
        error={fieldErrors.email}
        disabled={isSubmitting}
      />

      <FormField
        id="password"
        name="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        required
        maxLength={128}
        value={values.password}
        onChange={(event) => updateField('password', event.target.value)}
        error={fieldErrors.password}
        disabled={isSubmitting}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-accent text-accent-foreground focus-visible:ring-accent inline-flex w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-indigo-700 focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span aria-live="polite">{isSubmitting ? 'Signing in...' : 'Sign in'}</span>
      </button>
    </form>
  );
}
