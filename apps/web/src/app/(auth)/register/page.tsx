import type { Metadata } from 'next';
import Link from 'next/link';

import { GuestOnlyRoute } from '@/components/auth/guest-only-route';
import { RegisterForm } from '@/components/auth/register-form';
import { Card } from '@/components/ui/Card';
import { firstSearchParamValue, sanitizeRedirectPath } from '@/lib/auth/redirect';

export const metadata: Metadata = {
  title: 'Register',
};

interface RegisterPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams;
  const destination = sanitizeRedirectPath(firstSearchParamValue(params.next));

  return (
    <GuestOnlyRoute destination={destination}>
      <Card className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-foreground text-xl font-semibold">Create your account</h1>
          <p className="text-muted text-sm">Set up your workspace to start tracking clients.</p>
        </div>
        <RegisterForm redirectTo={destination} />
        <p className="text-muted text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-accent font-medium hover:underline">
            Log in
          </Link>
        </p>
      </Card>
    </GuestOnlyRoute>
  );
}
