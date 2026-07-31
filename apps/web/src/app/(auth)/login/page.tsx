import type { Metadata } from 'next';
import Link from 'next/link';

import { LoginForm } from '@/components/auth/login-form';
import { Card } from '@/components/ui/Card';

export const metadata: Metadata = {
  title: 'Log in',
};

export default function LoginPage() {
  return (
    <Card className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-foreground text-xl font-semibold">Log in</h1>
        <p className="text-muted text-sm">Welcome back. Enter your credentials to continue.</p>
      </div>
      <LoginForm />
      <p className="text-muted text-sm">
        New to ClientFlow?{' '}
        <Link href="/register" className="text-accent font-medium hover:underline">
          Create an account
        </Link>
      </p>
    </Card>
  );
}
